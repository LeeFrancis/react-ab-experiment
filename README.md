
React Component to try AB Testing with Optimizely or Planout

Probably a bitmore complex than needs to be but I am experimenting with which AB solution to use and want to leave it open. Login is in there to allow a provider to be supplied.




```jsx

          <ABExperiment
            id="58c70e0808e80285323eeb3b"
            name="navbar_color"
            propKey="color"
            description="What color to use for navbar"
            experimentType="property"
            prepend="#"
            provider="planout"
            planoutExperiment={planoutExperiment}
            goals= {["listenToSearchEvent"]}
            user={user}
            planoutUrl="http://0.0.0.0:4000/api/GoalResults"
            >
            <ReactNavbarContainer/>
          </ABExperiment>


```

This example will use a planout supplied serialized object to provide a color property to the ReactNavbar


```jsx

            <div>
              <ABExperiment 
                id="58c6aacb21500a53407f6a49"
                name="search_component"
                description="What search box to use?"
                experimentType="component"
                components={{
                  "MedicalSearch": <MedicalSearch/>,
                  "AcademicSearch": <AcademicSearch/>                  
                }}
                defaultComponent="AcademicSearch"
                provider="planout"
                planoutExperiment={planoutExperiment}
                goals={["listenToSearchEvent","listenToAutoCompleteEvent"]}
                user={user}
                planoutUrl="http://0.0.0.0:4000/api/GoalResults"
              />
            </div>
```

This example will use a planout serialized object to render a particular Search experience component
