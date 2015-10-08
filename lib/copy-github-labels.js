/**
 * Module dependencies
 */
var GitHubApi = require("github");
var extend = require('extend');

module.exports = function (opts) {

  // Create object to export
  var self = {};

  var defaultOptions = {
    // required
    version: "3.0.0",
    // optional
    debug: false,
    protocol: "https",
    host: "api.github.com",
    timeout: 5000,
    headers: {
      "user-agent": "Copy-GitHub-Labels" // GitHub is happy with a unique user agent
    },
    excludes: [],
    includes: []
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

      labels.forEach(function (label) {
        
        var exclude = matches(label.name, options.excludes);
        var explicitInclude = matches(label.name, options.includes);
        
        if (exclude && !explicitInclude) {
          return;
        }
        if (options.includes.length > 0 && !explicitInclude) {
          return;
        }
        
        // If dry run, just run callback and don't copy
        if(options.dryRun){
          return cb(null, label);
        }

        // Create label in destination repository
        self.github.issues.createLabel({
          user: destinationRepository.user,
          repo: destinationRepository.repo,
          name: label.name,
          color: label.color
        }, function (err, res) {
          if (err) {
            return cb(err);
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
 * Takes an array of regular expressions and determines if the given
 * label matches it. Labels are tested with ignoring case. Example:
 * 
 * matches('type-bug', ['type-*', 'severity-*']) === true
 * matches('TYPE-BuG', ['type-*']) === true
 * 
 * @param label - a String or a GH Label object that has a 'name' field
 * @param regexArr - an array of String regular expressions to test the given label against
 * @returns true if the given label is matched by anything in regexArr, false otherwise
 */
function matches(label, regexArr) {
  var matches;
  regexArr.forEach(function (regex, idx, arr) {
    var labelString = (typeof label === 'string') ? label : label.name;
    if (new RegExp(regex, 'i').test(label)) {
      matches = true;
    }
  });

  if (typeof matches === 'undefined') {
      return false;
  }

  return matches;
}

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
 *   user: 'jvandemo',
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
      user: parts[0],
      repo: parts[1],
      page: 1
    }
  }
  if (input.user && input.repo) {
    if(!input.hasOwnProperty('page')){
      input.page = 1;
    }
    return input;
  }
  return null;
}
