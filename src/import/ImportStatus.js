import React, { useState } from 'react';
import styled from 'styled-components';
import { GraphqlError, NetworkError } from '../common/ErrorHandling';
import { GET_UPLOADS } from '../common/Queries';
import { Query } from 'react-apollo';
import {
  SUCCESS_COLOR,
  DANGER_COLOR,
  WORKING_COLOR,
  LIST_SEPARATOR_COLOR,
} from '../common/variables';

const TaskContainer = styled.div`
  justify-content: space-around;
  display: flex;
  padding: 20px 5px;
  border-bottom: 1px solid ${LIST_SEPARATOR_COLOR};
  ${props => props.first && `border-top: 1px solid ${LIST_SEPARATOR_COLOR};`}
`;

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

const TaskDescription = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  align-items: center;
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

const TaskDescriptionItem = styled.div`
  flex-grow: ${props => (props.grow ? props.grow : '1')};
  flex-basis: 0;
  flex-shrink: ${props => (props.shrink ? props.shrink : '0')};
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

function Task({ queuedAt, caseName, failed, complete, message, first }) {
  const queuedAtDate = new Date(queuedAt);

  return (
    <TaskContainer first={first}>
      <TaskStatusComponent complete={complete} failed={failed} />
      <TaskDescription>
        <TaskDescriptionItem shrink="3">
          <b>Case: </b>
          {caseName}
        </TaskDescriptionItem>
        <TaskDescriptionItem grow={!failed ? '5' : '2'}>
          <b>Import date: </b>
          {`${queuedAtDate.toDateString()}`}
        </TaskDescriptionItem>
        {failed && (
          <TaskDescriptionItem grow={'3'}>
            <b>Message: </b>
            {message}
          </TaskDescriptionItem>
        )}
      </TaskDescription>
    </TaskContainer>
  );
}

const TasksWrapper = styled.div`
  margin-bottom: 50px;
`;

function Tasks({ tasks }) {
  return (
    <TasksWrapper>
      {tasks.map((task, index) => (
        <Task key={`task-${index}`} {...task} first={index === 0} />
      ))}
    </TasksWrapper>
  );
}

const getHasWorkingTasks = data => {
  return data.tasks.some(task => !task.failed && !task.complete);
};

const ACTIVE_IMPORT_INTERVAL = 1000;

const ImportStatus = ({ user }) => {
  const [pollInterval, setPollInterval] = useState(ACTIVE_IMPORT_INTERVAL);
  const [hasWorkingTasks, setHasWorkingTasks] = useState(true);
  return (
    <Query
      query={GET_UPLOADS}
      variables={{
        user: user.toLowerCase(),
      }}
      onCompleted={data => setHasWorkingTasks(getHasWorkingTasks(data))}
      pollInterval={pollInterval}
    >
      {props => {
        const { loading, error, data, stopPolling, client } = props;

        if (loading) return <p>Loading</p>;
        if (error)
          return error.networkError ? NetworkError(error) : GraphqlError(error);

        if (!hasWorkingTasks && pollInterval === ACTIVE_IMPORT_INTERVAL) {
          stopPolling();
          setPollInterval(0);
          client.resetStore();
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
