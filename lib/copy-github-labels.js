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
    cb = cb || function () {
    };

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

      })
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
      repo: parts[1]
    }
  }
  if (input.user && input.repo) {
    return input;
  }
  return null;
}
