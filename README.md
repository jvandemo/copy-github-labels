# Copy GitHub labels

Easily copy GitHub labels from one repository to another. Uses [GitHub API for Node.js](https://github.com/mikedeboer/node-github).

[![Build Status](https://travis-ci.org/jvandemo/copy-github-labels.svg?branch=master)](https://travis-ci.org/jvandemo/copy-github-labels)

## Installation

```bash
$ npm install copy-github-labels
```

## Example

```javascript
var copyGitHubLabels = require('copy-github-labels')();

// Optionally use credentials
copyGitHubLabels.authenticate({
  token: 'your-github-token'
});

// Copy labels from one repository to another
copyGitHubLabels.copy('github-username/src-repo', 'github-username/dest-repo');

```

## Options

By default, the module is configured to use GitHub, but you can optionally pass in settings during instantiation:

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

### v1.1.0

- support optional callback

### v1.0.0

- added authentication support
- added documentation
- packaged as npm module
