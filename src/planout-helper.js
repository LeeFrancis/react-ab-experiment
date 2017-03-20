/* eslint-disable no-var, no-undef, no-console */

const planout = require("planout");
const fetch = require("isomorphic-fetch");

/* This is the sample experiment taken from https://github.com/HubSpot/PlanOut.js/blob/master/examples/sample_planout_es5.js */
Object.getOwnPropertyDescriptors = function getOwnPropertyDescriptors(obj) {
  var descriptors = {};
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      descriptors[prop] = Object.getOwnPropertyDescriptor(obj, prop);
    }
  }
  return descriptors;
};
/* eslint-disable no-extend-native, consistent-this */
Function.prototype.extend = function extend(proto) {
  var superclass = this;
  var constructor;

  if (!proto.hasOwnProperty("constructor")) {
    Object.defineProperty(proto, "constructor", {
      value() {
            // Default call to superclass as in maxmin classes
        superclass.apply(this, arguments);
      },
      writable: true,
      configurable: true,
      enumerable: false
    });
  }
  constructor = proto.constructor;

  constructor.prototype = Object.create(this.prototype, Object.getOwnPropertyDescriptors(proto));

  return constructor;
};
/* eslint-enable no-extend-native, consistent-this */
/* End extend helper */

// this would be a strategy if we have mulitple configurations
const logGoalsToMongoDB = (planoutUrl, data) => {
  data.userid = data.inputs.userid;
  data.experimentid = data.extra_data.experimentid;

  const payload = JSON.stringify(
    {
      goalresultid: 0,
      experimentname: data.name,
      eventtype: data.event,
      timestamp: data.time,
      userid: data.inputs.id,
      experimentid: data.extra_data.experimentid,
      extradata: {}
    }
  );


  fetch(planoutUrl, {
    method: "POST",
    body: payload,
    headers: { "Content-Type": "application/json" }
  })
  .then((rsp) => {
    console.log("logged goal results", rsp);
  });
};

const getExperimentInstance = function (planoutUrl, planoutObject, id) {
  const DemoExperiment = planout.Experiment.extend({
    setup() {
      this.name = "SampleExperiment";
    },
    assign(params, args) {
      this.script = planoutObject;
      const interpreterInstance = new planout.Interpreter(
          this.script,
          this.getSalt(),
          args
      );
      const results = interpreterInstance.getParams();
      Object.keys(results).forEach(function (result) {
        params.set(result, results[result]);
      });
      return interpreterInstance.inExperiment;

    },
    configureLogger() {
      return;
    },
    log(stuff) {
      console.log(stuff);
      logGoalsToMongoDB(planoutUrl, stuff);
    },
    getParamNames() {
      return this.getDefaultParamNames();
    },
    previouslyLogged() {
      return this._exposureLogged;
    }
  });
  return new DemoExperiment(
      {id}
  );
};

export default getExperimentInstance;
