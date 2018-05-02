/**
 * Module dependencies
 */
var GitHubApi = require("@octokit/rest");
var extend = require('extend');

// Arrow functions aren't allowed as constructors
module.exports = function (opts) {
  var self = {};

  var defaultOptions = {
    headers: {
      "user-agent": "Copy-GitHub-Labels", // GitHub is happy with a unique user agent
      accept: "application/vnd.github.symmetra-preview+json" // Enable emoji + description support
    }
  };

  var options = extend({}, defaultOptions, opts);

  self.github = new GitHubApi(options);

  /**
   * Authenticates with GitHub
   * @param {*} credentials The credentials used for authenticating.
   */
  self.authenticate = (credentials) => self.github.authenticate(credentials);
  /**
   * Copies labels from the source repository to the destination repository
   * @param {string} sourceRepository The source repository to copy labels from
   * @param {string} destinationRepository The destination repository to copy labels to
   * @param {copyLabelsCallback} [cb] The callback function after this is executed.
   */
  self.copy = (sourceRepository, destinationRepository, cb) => {
    sourceRepository = parseRepo(sourceRepository);
    destinationRepository = parseRepo(destinationRepository);
    cb = cb || function () { };

    if (!sourceRepository) {
      return cb(new Error('Invalid source repository'));
    }

    if (!destinationRepository) {
      return cb(new Error('Invalid destination repository'));
    }

    // Get all labels from source
    self.github.issues.getLabels(sourceRepository).then(result => {
      result.data.forEach((label) => {
        if (options.dryRun) {
          return cb(null, label);
        }
        var labelToCreate = {
          owner: destinationRepository.owner,
          repo: destinationRepository.repo,
          name: label.name,
          color: label.color
        };
        // Check if label has description
        if (label.description) {
          labelToCreate.description = label.description;
        }
        // Create label in destination repository
        self.github.issues.createLabel(labelToCreate, (err, res) => {
          if (err) {
            return cb(err);
          }
          return cb(null, res);
        });
      });

      // If the response contains a link header with rel="next", then
      // fetch the following page because there are more labels available
      if (labels.meta && labels.meta.hasOwnProperty('link')) {
        if (labels.meta.link.indexOf('rel="next"') !== -1) {
          sourceRepository.page += 1;
          self.copy(sourceRepository, destinationRepository, cb);
        }
      }
    }).catch(err => { return cb(err) });
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
const parseRepo = (input) => {
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
  if (input.user && input.repo) {
    if (!input.hasOwnProperty('page')) {
      input.page = 1;
    }
    return input;
  }
  return null;
}

/**
 * Callback used in {@link copyGitHubLabels#copy}
 * @callback copyLabelsCallback
 * @param {*} error The error thrown when an error occured
 * @param {*} label The label object
 */