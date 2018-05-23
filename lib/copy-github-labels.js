/**
 * Module dependencies
 */
var GitHubApi = require("@octokit/rest");
var extend = require('extend');

module.exports = function (opts) {

  // Create object to export
  var self = {};

  var defaultOptions = {
    // required
    version: "3.0.0",
    // optional
    debug: false,
    baseUrl: "https://api.github.com",
    timeout: 5000,
    headers: {
      "accept": "application/vnd.github.v3+json",
      "user-agent": "Copy-GitHub-Labels" // GitHub is happy with a unique user agent
    }
  };

  var options = extend({}, defaultOptions, opts);

  self.github = new GitHubApi(options);

  self.authenticate = function (credentials) {
    self.github.authenticate(credentials);
  };

  self.copy = function (sourceRepository, destinationRepository, cb) {

    sourceRepository = parseRepo(sourceRepository);
    destinationRepository = parseRepo(destinationRepository);

    cb = cb || function () {};

    if (!sourceRepository) {
      return cb(new Error('Invalid source repository'));
    }

    if (!destinationRepository) {
      return cb(new Error('Invalid destination repository'));
    }

    // Get all labels from source
    self.github.issues.getLabels(sourceRepository, function (err, labels) {

      if (err) {
        return cb(err);
      }
      
      labels = labels.data;
      labels.forEach(function (label) {

        // If dry run, just run callback and don't copy
        if(options.dryRun){
          return cb(null, label);
        }

        // Create label in destination repository
        console.log(JSON.stringify(label));
        self.github.issues.createLabel({
          owner: destinationRepository.owner,
          repo: destinationRepository.repo,
          name: label.name,
          description: label.description || '',
          color: label.color
        }, function (err, res) {
          // if create fails and force, then try update
          if (err && options.force) {
            self.github.issues.updateLabel({
              owner: destinationRepository.owner,
              repo: destinationRepository.repo,
              name: label.name,
              description: label.description || '',
              color: label.color
            }, function (err, res) {
              if (err) {
                return cb(err, label);
              }
            });
          }
          return cb(null, res);
        });
      });

      // If the response contains a link header with rel="next", then
      // fetch the following page because there are more labels available
      if(labels.meta && labels.meta.hasOwnProperty('link')){
        if(labels.meta.link.indexOf('rel="next"') !== -1){
          sourceRepository.page += 1;
          self.copy(sourceRepository, destinationRepository, cb);
        }
      }

    });

  };

  return self;

};

/**
 * Parse repository
 *
 * Accepts string like:
 *
 * 'jvandemo/copy-github-labels'
 *
 * or objects like:
 *
 * {
 *   owner: 'jvandemo',
 * 	 repo: 'copy-github-labels'
 * }
 * @param repo
 * @returns {*}
 */
function parseRepo(input) {
  if (typeof input === 'string') {
    var parts = input.split('/');
    if (parts.length < 2) {
      return null;
    }
    return {
      owner: parts[0],
      repo: parts[1],
      page: 1
    }
  }
  if (input.owner && input.repo) {
    if(!input.hasOwnProperty('page')){
      input.page = 1;
    }
    return input;
  }
  return null;
}
