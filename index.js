var _ = require('lodash');
var Q = require('q');
var markdown = require('markdown').markdown;
var fs = require('fs');
var path = require('path');
var toRead = ['description.md', 'title.txt', 'recipe.json'];
var GIT_CONTENT_PATH = 'https://raw.githubusercontent.com/elasticio/recipes/master/';
var IMAGE_LARGE = '/icon_large.png';
var IMAGE_SMALL = '/icon_small.png';
var cache;

exports.all = all;

function all() {
    if (cache) {
        return Q(cache);
    } else {
        return readAll();
    }
}

function readAll() {
    return Q.nfcall(fs.readdir, __dirname)
        .then(processDir)
        .then(cacheResult);
}

function cacheResult(result) {
    cache = result;
    return cache;
}

function tagsFilter(filename) {
    return !filename.indexOf('.tag_');
}

function tagsMap(filename) {
    return filename.replace('.tag_', '');
}

function filterPlan(filename) {
    return !filename.indexOf('.plan_');
}

function processDir(files) {
    var promises = [];

    files.forEach(getRecipe);

    function getRecipe(recipeId) {
        if (!~recipeId.indexOf('.') && recipeId !== 'node_modules') {

            promises.push(
                Q.all(
                    toRead.map(readFile)
                        .concat(Q.nfcall(fs.readdir, path.join(__dirname, recipeId)))
                )
                    .then(prepareRecipe)
            );

            function readFile(fileName) {
                return Q.nfcall(
                    fs.readFile,
                    path.join(__dirname, recipeId, fileName),
                    'utf8'
                );
            }

            function prepareRecipe(datas) {
                var files = datas[3];
                var desc = markdown.toHTML(datas[0]);
                var title = datas[1];
                var tags = files.filter(tagsFilter).map(tagsMap);
                var plan = _.find(files, filterPlan);

                if (plan) {
                    plan = plan.replace('.plan_', '');
                }
                return _.extend({
                    _id: recipeId,
                    description: desc,
                    title: title,
                    plan: plan,
                    icon: GIT_CONTENT_PATH + recipeId + IMAGE_SMALL,
                    image: GIT_CONTENT_PATH + recipeId + IMAGE_LARGE,
                    compId: 'salesforce',   //@todo this must be deleted
                    partnerId: 'debitoor',  //@todo this must be overwritten somehow??
                    tags: tags
                }, JSON.parse(datas[2]));
            }
        }
    }
    return Q.all(promises);
}