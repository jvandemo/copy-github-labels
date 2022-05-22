var CopyGitHubLabels = require('../');
var GitHubApi = require("@octokit/rest");
var chai = require('chai');
var expect = chai.expect;
const githubOptions = {
	timeout: 5000,
	headers: {
	  accept: 'application/vnd.github.symmetra-preview+json',
	  'user-agent': 'Copy-GitHub-Labels'
	},
	baseUrl: 'https://api.github.com'
};

describe('CopyGitHubLabels', function(){

	it('should be a function', function(){
		expect(CopyGitHubLabels).to.be.a('function');
	});

});

describe('copyGitHubLabels', function(){

	var copyGitHubLabels = new CopyGitHubLabels();

	it('should be an object', function(){
		expect(copyGitHubLabels).to.be.a('object');
	});

	describe('#authenticate', function(){

		it('should be a function', function(){
			expect(copyGitHubLabels.authenticate).to.be.a('function');
		});

	});

	describe('#copy', function(){

		it('should be a function', function(){
			expect(copyGitHubLabels.copy).to.be.a('function');
		});

	});
});

describe('GithubAPI', function(){
	it('should be a function', function(){
		expect(GitHubApi).to.be.a('function');
	});

	it('should be an object', function(){
		const octokit = GitHubApi(githubOptions);
		expect(octokit).to.be.a('object');
	});

	it('should be a function', function(){
		const octokit = GitHubApi(githubOptions);
		expect(octokit.issues.getLabels).to.be.a('function');
	});

	it('should be an array', function(done){
		const testRepo = {
			owner: 'octocat',
			repo: 'Hello-World',
			page: 1
		  };
		const octokit = GitHubApi(githubOptions);
		octokit.issues.getLabels(testRepo, function (error, labels) {
			expect(labels).to.be.a('object');
			expect(labels.data).to.be.a('Array');
			expect(labels.data.length).to.be.at.least(1);
			done();
		});
	});
});