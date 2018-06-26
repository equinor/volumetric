import React from 'react';
import {GET_METRICS} from './ModelQueries';
import {Query} from 'react-apollo';
import VisToggler from './VisToggler';

const VisContainer = ({match}) => {
    return (
        <Query
            query={GET_METRICS}
            variables={{
                locationId: match.params.locationId,
            }}
        >
            {({loading, data}) => {
                if (loading) {
                    return <div>Loading...</div>;
                }
                return <VisToggler data={data}/>;
            }}
        </Query>
    );
};

export default VisContainer;