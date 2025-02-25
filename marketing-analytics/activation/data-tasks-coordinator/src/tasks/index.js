// Copyright 2019 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Hosts all kinds of tasks.
 */

'use strict';
const {TaskType} = require('../task_config/task_config_dao.js');
const {BaseTask, RetryableError,} = require('./base_task.js');
const {LoadTask} = require('./bigquery/load_task.js');
const {ExportTask} = require('./bigquery/export_task.js');
const {QueryTask} = require('./bigquery/query_task.js');
const {ExportSchemaTask} = require('./bigquery/export_schema_task.js');
const {DeleteDatasetTask} = require('./bigquery/delete_dataset_task.js');
const {DataTransferTask} = require('./bigquery/data_transfer_task.js');
const {CopyGcsTask} = require('./copy_gcs_task.js');
const {PredictTask} = require('./predict_task.js');
const {QueryAdhTask} = require('./query_adh_task.js');
const {ReportTask} = require('./report_task.js');
const {KnotTask} = require('./knot_task.js');
const {MultipleTask} = require('./multiple_task.js');

/**
 * All tasks Sentinel supports.
 * @type {!Object<string,!BaseTask>}
 */
const ALL_TASKS = Object.freeze({
  [TaskType.LOAD]: LoadTask,
  [TaskType.EXPORT]: ExportTask,
  [TaskType.QUERY]: QueryTask,
  [TaskType.EXPORT_SCHEMA]: ExportSchemaTask,
  [TaskType.DELETE_DATASET]: DeleteDatasetTask,
  [TaskType.DATA_TRANSFER]: DataTransferTask,
  [TaskType.COPY_GCS]: CopyGcsTask,
  [TaskType.PREDICT]: PredictTask,
  [TaskType.QUERY_ADH]: QueryAdhTask,
  [TaskType.REPORT]: ReportTask,
  [TaskType.KNOT]: KnotTask,
  [TaskType.MULTIPLE]: MultipleTask,
});

/**
 * Returns a task instance based on the given configuration and parameters.
 * @param {Object<string,string>} taskConfig
 * @param {Object<string,string>} parameters
 * @return {!BaseTask}
 */
const buildTask = (taskConfig, parameters = {}) => {
  const taskClass = ALL_TASKS[taskConfig.type];
  if (!taskClass) throw new Error(`Unknown task type: ${taskConfig.type}`);
  const defaultProject = process.env['GCP_PROJECT'];
  return new taskClass(taskConfig, parameters, defaultProject);
};

module.exports = {
  BaseTask,
  buildTask,
  RetryableError,
};
