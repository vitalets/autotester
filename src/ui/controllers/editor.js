/**
 * Editor controller
 */

const mobx = require('mobx');
const state = require('../state');
const innerFileTpl = require('raw!./inner-file-tpl');
const localFs = require('../../utils/local-fs');
const utils = require('../../utils');

exports.init = function () {
  mobx.reaction(() => state.selectedFileUrl, url => url ? loadContent(url) : setContent(''));
};

exports.saveName = mobx.action(function (newName) {
  const index = getSelectedFileIndex();
  if (index >= 0) {
    state.innerFiles[index].path = newName;
    throw new Error('rename not supported');
    // state.selectedFile = newName;
  }
});

exports.saveCode = mobx.action(function (newCode) {
  state.selectedFileContent = newCode;
  localFs.save(state.selectedFileUrl, newCode);
});

exports.addFile = function () {
  const name = findFreeName(state.innerFiles);
  const file = {path: name};
  const fullPath = `${state.innerFilesPath}/${name}`;
  const code = innerFileTpl.replace('{name}', name);
  localFs.save(fullPath, code)
    .then(mobx.action(() => {
      state.innerFiles.push(file);
      state.selectedFile = name;
    }));
};

exports.deleteFile = mobx.action(function () {
  if (state.isInnerFiles && state.selectedFile) {
    const index = getSelectedFileIndex();
    if (index >= 0) {
      state.innerFiles.splice(index, 1);
      state.selectedFile = index > 0 ? state.innerFiles[index - 1].path : '';
      // todo: remove from local-fs
    }
  }
});

const setContent = mobx.action(content => state.selectedFileContent = content);

function loadContent(url) {
  const task = state.isInnerFiles ? localFs.readFile(url) : utils.fetchText(url);
  task.then(setContent, () => setContent(''));
}

function getSelectedFileIndex() {
  return state.innerFiles.findIndex(file => file.path === state.selectedFile);
}

function findFreeName(files) {
  for (let i = 1; i < 99; i++) {
    const name = `new_file_${i}`;
    if (!files.some(file => file.path === name)) {
      return name;
    }
  }
  return `new_file`;
}
