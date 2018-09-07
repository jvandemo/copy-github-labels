/**
 * This script demonstrates OAuth with GitHub using Inquirer.js
 */

var inquirer = require('inquirer');
var copyGitHubLabels = require('../index.js')();

/**
 * Checks if the variable isn't blank
 * @param {string} input The variable to validate
 * @returns {boolean}
 */
function validateRequired(input) {
  if (input != '' && input != null && input.replace(/\s/g, '').length) {
    return true;
  } else {
    return false;
  }
}
function parseRepo(input) {
  if (typeof input === 'string') {
    var parts = input.split('/');
    if (parts.length < 2) {
      return null;
    }
    return {
      owner: parts[0],
      repo: parts[1]
    }
  }
  if (input.user && input.repo) {
    return input;
  }
  return null;
}
var questions = [
  {
    message: 'Warning! This script will copy labels from one repository to the other and thus requires access to your username and password, as well as you having write-access to the repository to copy to! Continue?',
    type: 'confirm',
    name: 'confirmExecute',
    default: false
  },
  {
    message: 'Enter the GitHub repository to get labels from (your-username/your-repo):',
    name: 'sourceRepository',
    validate: (input) => {
      return validateRequired(input) && input.indexOf('/') > -1;
    },
    when: (answers) => {
      return answers.confirmExecute;
    }
  },
  {
    message: 'Enter the GitHub repository to copy labels to (your-username/your-repo):',
    name: 'destinationRepository',
    validate: (input) => {
      return validateRequired(input) && input.indexOf('/') > -1;
    },
    when: (answers) => {
      return answers.confirmExecute;
    }
  },
  // TODO: Add support for more authentication methods
  {
    message: 'Enter your GitHub username:',
    name: 'username',
    validate: (input) => {
      return validateRequired(input);
    },
    when: (answers) => {
      return answers.confirmExecute;
    }
  },
  {
    message: 'Enter your GitHub password:',
    name: 'password',
    type: 'password',
    validate: (input) => {
      return validateRequired(input);
    },
    when: (answers) => {
      return answers.confirmExecute;
    }
  },
  {
    message: 'Would you like to clear all labels of the destination repository?',
    name: 'clearAllLabels',
    type: 'confirm'
  }
];
inquirer.prompt(questions).then(result => {
  if (result.confirmExecute) {
    copyGitHubLabels.authenticate({ type: "basic", username: result.username, password: result.password });
    if (result.clearAllLabels) {
      copyGitHubLabels.github.issues.getLabels({ "owner": parseRepo(result.destinationRepository).owner, "repo": parseRepo(result.destinationRepository).repo }).then(() => {
        console.log('Done clearing!');
      }).catch((error) => {
        console.error(`An error occured: ${error}`);
      });
    }
    copyGitHubLabels.copy(result.sourceRepository, result.destinationRepository, () => {

    })
  }
})