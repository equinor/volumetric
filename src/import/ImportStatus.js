import React, { useState } from 'react';
import styled from 'styled-components';
import { GraphqlError, NetworkError } from '../common/ErrorHandling';
import { GET_UPLOADS } from '../common/Queries';
import { Query } from 'react-apollo';
import {
  SUCCESS_COLOR,
  DANGER_COLOR,
  WORKING_COLOR,
} from '../common/variables';
import { Row, TD, TH, Table } from '../common/Table';
import { getFormattedDate } from '../utils/date';

const TaskStatus = styled.div`
  text-align: center;
  align-items: center;
  justify-content: center;
  padding: 5px;
  display: inline-flex;
  margin-right: 35px;
  border: 1px solid ${props => props.color};
  color: ${props => props.color};
  border-radius: 4px;
  line-height: 20px;
`;

const TaskIcon = styled.div`
  height: 18px;
  width: 18px;
  line-height: 18px;
  border-radius: 50%;
  border: 1px solid;
  font-size: 14px;
  margin-right: 8px;
`;

const TaskStatusWrapper = styled.div`
  min-width: 140px;
`;

const TaskStatusComponent = ({ complete, failed }) => {
  if (failed) {
    return (
      <TaskStatusWrapper>
        <TaskStatus color={DANGER_COLOR}>
          <TaskIcon>&#10007;</TaskIcon>
          failed
        </TaskStatus>
      </TaskStatusWrapper>
    );
  } else if (complete) {
    return (
      <TaskStatusWrapper>
        <TaskStatus color={SUCCESS_COLOR}>
          <TaskIcon>&#10003;</TaskIcon>
          complete
        </TaskStatus>
      </TaskStatusWrapper>
    );
  } else {
    return (
      <TaskStatusWrapper>
        <TaskStatus color={WORKING_COLOR}>Working...</TaskStatus>
      </TaskStatusWrapper>
    );
  }
};

function Task({ queuedAt, caseName, failed, complete, message }) {
  return (
    <Row>
      <TD>
        <TaskStatusComponent complete={complete} failed={failed} />
      </TD>
      <TD>{caseName}</TD>
      <TD>{`${getFormattedDate(queuedAt)}`}</TD>
      <TD title={failed ? message : ''} grow={2}>
        {failed && message}
      </TD>
    </Row>
  );
}

function Tasks({ tasks }) {
  return (
    <Table>
      <thead>
        <Row>
          <TH>Status</TH>
          <TH>Case</TH>
          <TH>Import date</TH>
          <TH grow={2}>Message</TH>
        </Row>
      </thead>
      <tbody>
        {tasks.map((task, index) => (
          <Task key={`task-${index}`} {...task} />
        ))}
      </tbody>
    </Table>
  );
}

const getHasWorkingTasks = data => {
  return data.tasks.some(task => !task.failed && !task.complete);
};

const ACTIVE_IMPORT_INTERVAL = 1000;

const ImportStatus = ({ user }) => {
  const [isPolling, setIsPolling] = useState(false);
  return (
    <Query
      query={GET_UPLOADS}
      variables={{
        user: user.toLowerCase(),
      }}
    >
      {props => {
        const {
          loading,
          error,
          data,
          startPolling,
          stopPolling,
          client,
        } = props;

        if (loading) return <p>Loading</p>;
        if (error)
          return error.networkError ? NetworkError(error) : GraphqlError(error);

        const hasWorkingTasks = getHasWorkingTasks(data);
        if (hasWorkingTasks && !isPolling) {
          startPolling(ACTIVE_IMPORT_INTERVAL);
          setIsPolling(true);
        } else if (!hasWorkingTasks && isPolling) {
          stopPolling();
          client.resetStore();
          setIsPolling(false);
        }

        if (data.tasks.length === 0) {
          return <div>No tasks</div>;
        }

        return <Tasks tasks={data.tasks} />;
      }}
    </Query>
  );
};

export default ImportStatus;
