import React, {PropTypes} from "react";


class ABExperiment extends React.Component {
  constructor({provider = "planout"}) {
    super();
    this.provider = provider;
  }

  getExperimentInstance() {
    const inst = {
      "optimizely": () => {
        const optimizely = require("optimizely-client-sdk");
        const {store} = this.context;
        const {optimizelyJSON} = store.getState();
        return optimizely.createInstance(
          { datafile: optimizelyJSON }
        );
      },
      "planout": () => {
        const planoutHelper = require("planout-helper");
        const {id} = this.props;
        const {store} = this.context;
        const {experiments, user = {}} = store.getState();
        const experiment = (experiments || []).find((exp) => exp.experimentId === id);

        //
        return experiment ?
          planoutHelper.getExperimentInstance(
            "http://0.0.0.0:4000/api/GoalResults",
            experiment.json, user.id || 0
          ) :
          undefined;
      }
    };
    return inst[this.provider] ? inst[this.provider]() : undefined;
  }

  enroll(expInst, name) {
    const inst = {
      "optimizely": () => {
        const {prepend} = this.props;
        const {store} = this.context;
        const {user = {}} = store.getState();
        const val = expInst.activate(
          name,
          `${user.id || 0}`
        );
        return `${prepend || ""}${val}`;
      },
      "planout": () => expInst.get(name)
    };
    return inst[this.provider](expInst, name);
  }


  innerPartial(func) {
    const args = Array.prototype.slice.call(arguments).splice(1);
    return () => {
      const allArguments = args.concat(Array.prototype.slice.call(arguments));
      return func.apply(this, allArguments);
    };
  }

  componentExperiment() {
    const {defaultComponent} = this.props;
    const {name, id, goals} = this.props;
    const expInstance = this.getExperimentInstance();
    const invalidComponent = <div>Invalid Experiment</div>;

    const passprops = {};
    // iterate over goals
    goals.forEach((val) => {
      passprops[val] = this.innerPartial(this.handleSuccessEvent, val, id);
    });

    const component = this.getComponentInstance(
        expInstance ? this.experimentGet(expInstance, name, this.provider) :
        defaultComponent, passprops);


    return component ?
      component :
      (this.getComponentInstance(defaultComponent) || invalidComponent);
  }

  /* Grab all children - this can deal with multiple children or a single child
   */
  propertyExperiment() {
    const {children, propKey, name } = this.props;
    const expInstance = this.experimentInstance();
    const clonedChildren = [];

    if (expInstance) {
      const arrayChildren = typeof children === "object" ? [children] : children;
      const experimentVal = this.enroll(expInstance, name);
      for (const child of arrayChildren) {
        const extendedProp = {};
        extendedProp[propKey] = experimentVal;
        clonedChildren.push(React.cloneElement(
          child, extendedProp
        ));
      }
    }
    return clonedChildren.length === 1 ? clonedChildren[0] : clonedChildren;
  }

  /* eslint-disable no-console, no-undef */
  handleSuccessEvent(theType) {
    const expInstance = this.getExperimentInstance();
    // event type should be a constant
    //should use something other that args collection here
    if (expInstance) {
      expInstance.logEvent(theType, {experimentid: arguments[1]});
    } else {
      console.log("Error : Failed to instantiate experiment instance for ", this.provider);
    }
  }
  /* eslint-enable no-console, no-undef */

  getComponentInstance(componentName, props = {}) {
    if (this.components && this.components[componentName]) {
      const comp = React.cloneElement(this.components[componentName], props);
      return comp;
    }
    return null;
  }

  render() {
    const {experimentType} = this.props;
    const component = experimentType === "property" ?
      this.propertyTest() : this.componentTest();
    return (
      <div>
      { component }
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
  children: React.PropTypes.arrayOf(React.PropTypes.element),
  propKey: React.string,
  experimentType: React.PropTypes.string,
  planoutUrl: React.PropTypes.string
};


export default ABExperiment;
