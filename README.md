# Copy GitHub labels

Easily copy GitHub labels from one repository to another.

[![Build Status](https://travis-ci.org/jvandemo/copy-github-labels.svg?branch=master)](https://travis-ci.org/jvandemo/copy-github-labels)

## Installation

```bash
npm install copy-github-labels
```

## Example

```javascript
var copyGitHubLabels = require('copy-github-labels')();

// Optionally use credentials
copyGitHubLabels.authenticate({
  token: 'your-github-token'
});

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

## API

## Change log

### v1.0.0

- added authentication support
- added documentation
- packaged as npm module
