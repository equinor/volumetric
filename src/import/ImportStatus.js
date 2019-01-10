import React from 'react';
import styled from 'styled-components';
import { GET_UPLOADS } from '../common/Queries';
import GraphqlError from '../common/GraphqlErrorHandling';
import { Query } from 'react-apollo';

const UploadFooter = styled.div`
  justify-content: space-between;
  align-items: center;
  background-color: white;
  width: 100%;
  display: flex;
  position: fixed;
  bottom: 0px;
  border: 1px solid rgb(230, 230, 230);
  box-shadow: 0 -2px 4px rgb(230, 230, 230, 0.9);
`;

const TaskContainer = styled.div`
  background-color: #bfbfbf
  justify-content: space-around;
  display: flex;
  border: 1px solid white;
  border-radius: 5px;
  margin: 2px;
`;

const TaskStatus = styled.h5`
  margin: 5px;
`;

const TaskDescription = styled.div`
  font-size: 14px;
  display: flex;
  flex-direction: column;
  margin: 5px;
`;

const TaskCheckMark = styled.span`
  font-size: 24px;
  color: green;
`;

const TaskCheckCross = styled.span`
  font-size: 24px;
  color: #e54242;
`;

const DownArrow = styled.i`
  border: solid black;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(45deg);
`;

const Circle = styled.div`
  border: 2px solid #ccc;
  border-radius: 50%;
  height: 18px;
  width: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 5px;

  &:hover {
    border: 2px solid black;
  }
`;

const MaximizeButton = styled.span`
  cursor: pointer;
  font-size: 19px;
  padding: 5px 0px 0px 5px;
  position: fixed;
  bottom: 0px;
  right: 0px;
  border: 1px solid rgb(230, 230, 230);
  border-top-left-radius: 15px;
  box-shadow: 0 -1px 4px rgb(230, 230, 230, 0.9);
`;

function MinimizeButton({ minimizeMaximize }) {
  return (
    <Circle onClick={minimizeMaximize}>
      <DownArrow />
    </Circle>
  );
}

function Task({ id, caseName, failed, complete, message }) {
  let status;

  if (failed) {
    status = <TaskCheckCross>&#10007;</TaskCheckCross>;
  } else {
    if (complete) {
      status = <TaskCheckMark>&#10003;</TaskCheckMark>;
    } else {
      status = 'Working...';
    }
  }
  return (
    <TaskContainer key={id}>
      <TaskDescription>
        <div>
          <b>Case: </b>
          {caseName}
        </div>
        <div>
          <b>ID: </b>
          {id}
        </div>
        {failed && (
          <div>
            <b>Message: </b>
            {message}
          </div>
        )}
      </TaskDescription>
      <TaskStatus>{status}</TaskStatus>
    </TaskContainer>
  );
}

function ImportFooterWrapper({ tasks, hidden, minimizeMaximize }) {
  let taskItems = tasks.map(task => Task(task));
  return (
    <div>
      {hidden ? (
        <MaximizeButton onClick={minimizeMaximize}>Show Uploads</MaximizeButton>
      ) : (
        <UploadFooter>
          {taskItems}
          <MinimizeButton minimizeMaximize={minimizeMaximize} />
        </UploadFooter>
      )}
    </div>
  );
}

class ImportStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hidden: true,
      tasks: [],
      pollInterval: 0,
      variables: {
        // TODO: Make API CaseInsensitive
        user: props.user.toLowerCase(),
        hours: 48,
      },
    };
    this.minimizeMaximize = this.minimizeMaximize.bind(this);
  }

  minimizeMaximize() {
    this.setState(prevState => ({
      hidden: !prevState.hidden,
      pollInterval: prevState.hidden ? 1500 : 0,
    }));
  }

  render() {
    return (
      <Query
        query={GET_UPLOADS}
        variables={this.state.variables}
        pollInterval={this.state.pollInterval}
      >
        {props => {
          const { loading, error, data } = props;

          if (loading) return <p>Loading</p>;
          if (error) return <GraphqlError graphError={error} />;

          return (
            data.tasks.length !== 0 && (
              <ImportFooterWrapper
                tasks={data.tasks}
                hidden={this.state.hidden}
                minimizeMaximize={this.minimizeMaximize}
              />
            )
          );
        }}
      </Query>
    );
  }
}

export default ImportStatus;
