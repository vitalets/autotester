/**
 * Editor controller
 */

const mobx = require('mobx');
const fs = require('bro-fs');
const state = require('../state');
const innerFileTpl = require('raw!./inner-file-tpl');
const utils = require('../../utils');

exports.init = function () {
  mobx.reaction(() => state.selectedFileUrl, url => url ? loadContent(url) : setContent(''));
};

exports.saveName = function (newName) {
  if (!newName) {
    // todo: warning?
    return;
  }
  const index = getSelectedFileIndex();
  if (index >= 0) {
    const oldPath = `${state.innerFilesPath}/${state.selectedFile}`;
    const newPath = `${state.innerFilesPath}/${newName}`;
    fs.rename(oldPath, newPath)
      .then(mobx.action(() => {
        state.innerFiles[index].path = newName;
        state.selectedFile = newName;
      }));
  }
};

exports.saveCode = mobx.action(function (newCode) {
  state.selectedFileContent = newCode;
  fs.writeFile(state.selectedFileUrl, newCode);
});

exports.addFile = function () {
  const name = findFreeName(state.innerFiles);
  const file = {path: name};
  const fullPath = `${state.innerFilesPath}/${name}`;
  const code = innerFileTpl.replace('{name}', name);
  fs.writeFile(fullPath, code)
    .then(mobx.action(() => {
      state.innerFiles.push(file);
      state.selectedFile = name;
    }));
};

exports.deleteFile = mobx.action(function () {
  if (state.isInnerFiles && state.selectedFile) {
    const index = getSelectedFileIndex();
    const path = state.selectedFileUrl;
    if (index >= 0) {
      state.innerFiles.splice(index, 1);
      state.selectedFile = index > 0 ? state.innerFiles[index - 1].path : '';
      fs.unlink(path);
    }
  }
});

const setContent = mobx.action(content => state.selectedFileContent = content);

function loadContent(url) {
  const task = state.isInnerFiles ? fs.readFile(url) : utils.fetchText(url);
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
