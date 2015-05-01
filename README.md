# Copy GitHub labels

Easily copy GitHub labels from one repository to another. Uses [GitHub API for Node.js](https://github.com/mikedeboer/node-github).

[![Build Status](https://travis-ci.org/jvandemo/copy-github-labels.svg?branch=master)](https://travis-ci.org/jvandemo/copy-github-labels)

![octocat](https://cloud.githubusercontent.com/assets/1859381/5422531/40186cf0-8287-11e4-941c-96cabdb3fb24.jpg)

## Installation

```bash
$ npm install copy-github-labels
```

## Example

```javascript
// Instantiate
var copyGitHubLabels = require('copy-github-labels')();

// Optionally use credentials
copyGitHubLabels.authenticate({
  token: 'your-github-token'
});

// Copy labels from one repository to another
copyGitHubLabels.copy('github-username/src-repo', 'github-username/dest-repo');

```

## Options

By default, `copyGitHubLabels` is configured to use GitHub, but you can optionally pass in an `options` object during instantiation:

```javascript
// Define custom options
var options = {
    // required
    version: "3.0.0",
    // optional
    debug: true,
    protocol: "https",
    host: "github.my-GHE-enabled-company.com",
    pathPrefix: "/api/v3", // for some GHEs
    timeout: 5000,
    headers: {
        "user-agent": "My-Cool-GitHub-App", // GitHub is happy with a unique user agent
    }
});

// Instantiate with custom options
var copyGitHubLabels = require('copy-github-labels')(options);
```

All [node-github](https://github.com/mikedeboer/node-github) API options are supported.

## API

Once you have instantiated `copyGitHubLabels`, you can use the following methods:

### authenticate(credentials)

Specify credentials to use when connecting to GitHub:

```javascript
// Use basic auth
copyGitHubLabels.authenticate({
    type: "basic",
    username: "mikedeboertest",
    password: "test1324"
});

// Or use oauth
copyGitHubLabels.authenticate({
    type: "oauth",
    token: "e5a4a27487c26e571892846366de023349321a73"
});

// Or use oauth key/ secret
copyGitHubLabels.authenticate({
    type: "oauth",
    key: "clientID",
    secret: "clientSecret"
});

// Or use a token
copyGitHubLabels.authenticate({
    type: "token",
    token: "userToken",
});
```

### copy(source, destination[, callback])

Copy labels from one repository to another:

```javascript
// A repo can be a string
var source = 'github-username/repo-name';

// Or an object
var destination = {
  user: 'github-username',
  repo: 'repo-name'
};

// Copy labels from one repository to another
copyGitHubLabels.copy(source, destination, function (err, label){

  // Handle errors
  if(err){
  	return console.log('Could not copy label: ' + err);
  }

  // Copy succeeded
  console.log('Label copied successfully: ' + label)
});
```

## Change log

### v1.3.0

- added support for more than 30 labels
- reformatted source code
- updated documentation

### v1.2.1

- fix documentation

### v1.2.0

- added documentation
- added additional unit tests

### v1.1.0

- added support for obsolete callback

### v1.0.0

- added authentication support
- added documentation
- packaged as npm module
