import { Button, Tabs, Tab } from "@mui/material";
import { Theme } from "@emotion/react";
import { useEffect, useState } from "react";

import CategoryFilters from "./CategoryFilters";

interface FilterPaneProps {
	theme: Theme;
	inputCategories: string[];
	outputCategories: string[];
	filters: { [key: string]: number[] };
	setFilters: (newFilter: { [key: string]: number[] }) => void;
	categoryEnabled: { [key: string]: boolean };
	setCategoryEnabled: (newCatEnabled: { [key: string]: boolean }) => void;
}

function FilterPane({
	theme, inputCategories, outputCategories, filters, setFilters, categoryEnabled, setCategoryEnabled
	} : FilterPaneProps) {

  // { category -> use filter }
	const [filterEnabled, setFilterEnabled] = useState<{ [key: string]: boolean }>({});

  const [filterIndices, setFilterIndices] = useState([ [0, 0], [0, 0], [0, 0]]);
  const [selectedTab, setSelectedTab] = useState(0);


  // disable or enable all filters
  const setCategoryStatus = (enabled: boolean) => {
    let fullyEnabled : { [key: string] : boolean } = {};
    for (let category of inputCategories.concat(outputCategories)) {
      fullyEnabled[category] = enabled;
    }
    setCategoryEnabled(fullyEnabled);
  }

  // reset all filter ranges to [0, Infinity]
  const resetFilters = () => {
    let fullFilterRange : { [key: string] : number[] } = {};
    for (let category of inputCategories.concat(outputCategories)) {
      fullFilterRange[category] = [0, Infinity];
    }
    setFilters(fullFilterRange);
  }

  // disable or enable all filters
  const setFilterStatus = (enabled: boolean) => {
    let fullyEnabled : { [key: string] : boolean } = {};
    for (let category of inputCategories.concat(outputCategories)) {
      fullyEnabled[category] = enabled;
    }
    setFilterEnabled(fullyEnabled);
  }

  // Pass bound = "min"/"max" to update minVal/maxVal of category
  const updateFilter = (category : string, bound : string, val : number) => {
    if (bound == "min") {
      setFilters({
        ...filters,
        [category]: [val, filters[category][1]],
      });
    }
    else {
      setFilters({
        ...filters,
        [category]: [filters[category][0], val],
      });
    }
  }

  // enable/disable previously disabled/enabled filter
  const flipEnabledFilter = (category: string) => {
    setFilterEnabled({
        ...filterEnabled,
        [category] : filterEnabled[category] ? false : true,
    });
  }

  // enable/disable previously disabled/enabled category
  const flipEnabledCategory = (category: string) => {
    setCategoryEnabled({
        ...categoryEnabled,
        [category] : categoryEnabled[category] ? false : true,
    });
  }

  const indexCategory = (index: number) => {
    return index < inputCategories.length ?
            inputCategories[index] :
            outputCategories[index - inputCategories.length];
  }

	useEffect(() => {
    setCategoryStatus(true);
    resetFilters();
    setFilterStatus(false);
    setFilterIndices([
      [0, Math.floor(inputCategories.length / 2)],
      [Math.floor(inputCategories.length / 2), inputCategories.length],
      [inputCategories.length, inputCategories.length + outputCategories.length]
    ]);
	}, [inputCategories, outputCategories]);

	return (
		<div style={{
			width: "25vw",
			display: "flex",
			flexDirection: "column",
			justifyContent: "space-between",
			borderRadius: "10px",
			border: "1px solid white",
			padding: "10px",
			paddingTop: "2px",
			marginRight: "20px",
		}}>
			<Tabs value={selectedTab}
						onChange={(_, newTab) => setSelectedTab(newTab) }
						centered
						TabIndicatorProps={{ style: { backgroundColor: "white" } }}
						style={{ marginBottom: "5px", borderBottom: "1px solid white" }}>
				{Array.from({ length: 3 }).map((_, index) => (
					<Tab key={index} style={{ color: "white" }} label={["Inputs (1)", "Inputs (2)", "Outputs"][index]} />
				))}
			</Tabs>
			{
				/* Filter enable/disable/range buttons */
				Array.from({ length: filterIndices[selectedTab][1] - filterIndices[selectedTab][0] }).map((_, index) => (
					<CategoryFilters
						key={index + filterIndices[selectedTab][0]}
						category={indexCategory(index + filterIndices[selectedTab][0])}
						theme={theme}
						updateFilter={updateFilter}
						flipEnabledCategory={flipEnabledCategory}
						flipEnabledFilter={flipEnabledFilter}
						categoryEnabled={categoryEnabled[indexCategory(index + filterIndices[selectedTab][0])] ? true : false}
						filterEnabled={filterEnabled[indexCategory(index + filterIndices[selectedTab][0])] ? true : false}
						range={filters[indexCategory(index + filterIndices[selectedTab][0])]} />
					)
				)
			}

			{/* Mass Filter Operation Buttons */}
			<div style={{
				display: "flex",
				justifyContent: "space-evenly",
				marginTop: "auto",
				marginBottom: "3px",
			}}>
				<Button
					onClick={() => { setFilterStatus(false); setCategoryStatus(true); }}
					variant="contained"
					sx={{ width: "10vw", height: "7vh" }}>
					Show All
				</Button>
				<Button
					onClick={() => { resetFilters(); setFilterStatus(false); }}
					variant="contained"
					sx={{ width: "10vw", height: "7vh" }}>
					Reset All Filters
				</Button>
			</div>
		</div>
	)
}

export default FilterPane;