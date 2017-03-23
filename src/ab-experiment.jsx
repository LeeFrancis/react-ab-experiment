import React, {PropTypes} from "react";
import ComponentExperiment from "./component-experiment";
import PropertyExperiment from "./property-experiment";


class ABExperiment extends React.Component {
  constructor({provider = "planout"}) {
    super();
    this.provider = provider;
  }

  getExperimentInstance() {
    const inst = {
      "optimizely": () => {
        const {optimizelyExperiment} = this.props;
        const optimizely = require("optimizely-client-sdk");
        console.log(JSON.parse(optimizelyExperiment.body));
        // [TODO] Wrong place to parse this. Fix later.
        return optimizely.createInstance(
          { datafile: JSON.parse(optimizelyExperiment.body) }
        );
      },
      "planout": () => {
        const getExperimentInstance = require("./planout-helper").getExperimentInstance;
        const {id, planoutUrl, planoutExperiment, user = {id: 0}} = this.props;
        const experiment = (planoutExperiment || []).find((exp) => exp.experimentId === id);

        //
        return experiment ?
          getExperimentInstance(
            planoutUrl,
            experiment.json, user.id || 0
          ) :
          undefined;
      }
    };
    return inst[this.provider] ? inst[this.provider]() : undefined;
  }


  /* eslint-disable no-console, no-undef */
  handleSuccessEvent(theType) {
    //should use something other that args collection here
    console.log("Conversion Event Fired");
    
    const { provider = "planout" } = this.props;
    // should already be set...
    const expInstance = this.props.expInstance;
    const user = this.props.user;

    if(provider === "optimizely") {
        expInstance.track("Search_Initiated", `${user.id}`);
    } else if (this.expInstance) {
        expInstance.logEvent(theType, {experimentid: arguments[1]});
    } else {
      console.log("Error: Conversion event detected, but unable to locate experiment for tracking");
    }
  }
  /* eslint-enable no-console, no-undef */

  render() {
    const {experimentType} = this.props;
    this.expInstance = this.getExperimentInstance();
    const component = experimentType === "property" ?
      new PropertyExperiment(Object.assign({}, this.props, {
        expInstance: this.expInstance,
        handleConversion: this.handleSuccessEvent
      })) :
      new ComponentExperiment(Object.assign({}, this.props, {
        expInstance: this.expInstance,
        handleConversion: this.handleSuccessEvent
      }));

    return (
      <div>
      { component.get() }
      </div>
    );
  }

}
ABExperiment.propTypes = {
  id: PropTypes.string,
  prepend: PropTypes.string,
  components: PropTypes.objectOf(PropTypes.element),
  defaultComponent: PropTypes.string,
  name: PropTypes.string.isRequired,
  goals: PropTypes.arrayOf(React.PropTypes.string).isRequired,
  propKey: PropTypes.string,
  experimentType: PropTypes.string,
  planoutUrl: PropTypes.string,
  user: PropTypes.shape({
    id: PropTypes.string
  }),
  planoutExperiment: PropTypes.arrayOf(
    PropTypes.object
  ),
  optimizelyExperiment: PropTypes.object
};


export default ABExperiment;
