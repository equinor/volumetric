import React from 'react';
import {Query} from 'react-apollo';
import LocationSelector from './LocationSelector';
import {GET_MODELS} from '../ModelQueries';
import styled from 'styled-components';
import {withRouter} from 'react-router-dom';

const LocationSelectorStyled = styled.div`
  margin-top: 30px;
  margin-bottom: 30px;
`;

const initialState = {
    model: {
        selectedOption: null,
    },
    faultblock: {
        selectedOption: null,
    },
    zone: {
        selectedOption: null,
    },
};

class LocationSelectorContainer extends React.Component {
    constructor() {
        super();

        this.state = initialState;
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(key, selectedOption) {
        switch (key) {
            case 'model':
                this.setState(
                    Object.assign({}, initialState, {
                        [key]: {
                            selectedOption: selectedOption,
                        },
                    }),
                );
                break;
            case 'faultblock':
            case 'zone':
                this.setState({
                    [key]: {
                        selectedOption: selectedOption,
                    },
                    facies: {
                        selectedOption: null,
                    },
                });
                break;
            case 'facies':
                this.props.history.push(`/location/${selectedOption.value}`);
                this.setState({
                    [key]: {
                        selectedOption: selectedOption,
                    },
                });
                break;
            default:
                throw "Illegal key";
        }
    }

    render() {
        return (
            <Query query={GET_MODELS}>
                {({loading, error, data}) => {
                    if (loading) return <p>Loading...</p>;
                    if (error) return <p>Error :(</p>;

                    const hasSelectedModel = this.state.model.selectedOption !== null;
                    const hasSelectedFaultblock =
                        this.state.faultblock.selectedOption !== null;
                    const hasSelectedZone = this.state.zone.selectedOption !== null;
                    const shouldRenderFacies =
                        hasSelectedModel && hasSelectedFaultblock && hasSelectedZone;

                    return (
                        <LocationSelectorStyled>
                            <LocationSelector
                                handleChange={this.handleChange}
                                models={data.model}
                                state={this.state}
                            >
                                <LocationSelector.ModelSelector/>
                                {hasSelectedModel && <LocationSelector.ZoneSelector/>}
                                {hasSelectedModel && <LocationSelector.FaultblockSelector/>}
                                {shouldRenderFacies && <LocationSelector.FaciesSelector/>}
                            </LocationSelector>
                        </LocationSelectorStyled>
                    );
                }}
            </Query>
        );
    }
}

export default withRouter(LocationSelectorContainer);
