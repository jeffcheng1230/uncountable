import { useState, useEffect } from "react";
import * as d3 from "d3";
import { Typography, Grid2, Paper } from "@mui/material";
import { Theme } from "@emotion/react";

interface CategoryScatterPlotProps {
	theme: Theme;
  data: any;
  inputCategories: string[];
  outputCategories: string[];
  filters: { [key: string]: number[] };
}

function CategoryScatterPlot({theme, data, inputCategories, outputCategories, filters } : CategoryScatterPlotProps) {

	const [inputData, setInputData] = useState<{ [key: string]: any }[]>([]);
	const [outputData, setOutputData] = useState<{ [key: string]: any }[]>([]);
	const [inputMax, setInputMax] = useState<number>(0);
	const [outputMax, setOutputMax] = useState<number>(0);

  useEffect(() => {
    createDataPoints();
  }, [inputCategories, outputCategories]);

  useEffect(() => {
    renderCategoryScatter();
  }, [inputData, outputData]);

  const createDataPoints = () => {
    var inputArr : { [key: string]: any }[] = [];
    var outputArr : { [key: string]: any }[] = [];
    var inputMaxVal = 0;
    var outputMaxVal = 0;

    // disabledExperiments = all experiments such that one of its input/output
    // values does not fulfill a filter range -> do not display that experiment on graph
    var disabledExperiments : string[] = [];
    Object.keys(data).forEach((experiment) => {
      let inputs = data[experiment]["inputs"];
      Object.keys(inputs).forEach((category) => {
        if (inputCategories.includes(category) &&
            (filters[category][0] > inputs[category] || inputs[category] > filters[category][1]) &&
            (disabledExperiments.length == 0 || disabledExperiments[disabledExperiments.length - 1] != experiment)) {
          disabledExperiments.push(experiment);
        }
      });
      let outputs = data[experiment]["outputs"];
      Object.keys(outputs).forEach((category) => {
        if (inputCategories.includes(category) &&
            (filters[category][0] > inputs[category] || inputs[category] > filters[category][1]) &&
            (disabledExperiments.length == 0 || disabledExperiments[disabledExperiments.length - 1] != experiment)) {
          disabledExperiments.push(experiment);
        }
      });
    });

    // Push all acceptable datapoints onto inputArr and outputArr
    Object.keys(data).forEach((experiment) => {
      if (!disabledExperiments.includes(experiment)) {
        let inputs = data[experiment]["inputs"];
        Object.keys(inputs).forEach((category) => {
          if (inputCategories.includes(category)) {
            inputArr.push({
              experiment: experiment,
              category: category,
              value: inputs[category]
            });
            if (inputs[category] > inputMaxVal) {
              inputMaxVal = inputs[category];
            }
          }
        });
        let outputs = data[experiment]["outputs"];
        Object.keys(outputs).forEach((category) => {
          if (outputCategories.includes(category)) {
            outputArr.push({
              experiment: experiment,
              category: category,
              value: outputs[category]
            });
            if (outputs[category] > outputMaxVal) {
              outputMaxVal = outputs[category];
            }
          }
        });
      }
    });
    setInputData(inputArr);
    setOutputData(outputArr);
    setInputMax(inputMaxVal);
    setOutputMax(outputMaxVal);
  }

  const renderCategoryScatter = () => {
    const svgWidth = 1000;
    const svgHeight = 240;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };

    for (const graph of ["input", "output"]) {
      var data;
      var maxVal;
      var categories;
      if (graph == "input") {
        data = inputData;
        maxVal = inputMax;
        categories = inputCategories;
      }
      else {
        data = outputData;
        maxVal = outputMax;
        categories = outputCategories;
      }

      d3.select("#" + graph).selectAll("*").remove();

      const svg = d3
        .select("#" + graph)
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .style("background", "white")
        .style("border-radius", "8px")
        .style("box-shadow", "0 4px 10px rgba(0, 0, 0, 0.1)");

      // xScale: category string -> x axis location
      const xScale = d3.scaleBand()
      .domain(categories)
      .range([margin.left, svgWidth - margin.right])
      .padding(0.1);

      const yScale = d3.scaleLinear().domain([0, maxVal]).range([svgHeight - 40, 20]);

      // X Axis
      svg
        .append("g")
        .attr("transform", `translate(0,${svgHeight - 40})`)
        .call(d3.axisBottom(xScale))

      // Split x-axis label strings by space character
      // Append tspan for each word
      svg.selectAll(".tick text")
          .call(function(t){                
            t.each(function(d){ // for each one
              var self = d3.select(this);
              var s = self.text().split(" ");
              self.text("");
              for (const word of s) {
                self.append("tspan")
                  .attr("x", 0)
                  .attr("dy","1.1em")
                  .text(word);
              }
            })
          });

      // Y Axis
      svg
        .append("g")
        .attr("transform", "translate(40,0)")
        .call(d3.axisLeft(yScale));

      // Data points
      svg
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => (xScale(d.category) || 0) + xScale.bandwidth() / 2)
        .attr("cy", (d) => yScale(d.value))
        .attr("r", 6)
        .attr("fill", theme.palette.primary.main)
        .attr("opacity", 0.8)
        .attr("stroke", "red")
        .attr("stroke-width", 0);

      svg
        .selectAll("circle")
        .on("mouseover", (_, d: any) => {
          // highlight all data points of the experiment that is being hovered over
          d3.select("#input").selectAll("circle")
            .attr("stroke-width", (p: any) => d.experiment == p.experiment ? 5 : 0);
          d3.select("#output").selectAll("circle")
            .attr("stroke-width", (p: any) => d.experiment == p.experiment ? 5 : 0);
        })
        .on("mouseout", () => {
          d3.select("#input").selectAll("circle")
            .attr("stroke-width", 0);
          d3.select("#output").selectAll("circle")
            .attr("stroke-width", 0);
        });
    }
  };

	return (
    <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
      <Grid2 sx={{ marginBottom: "10px" }}>
        <Paper elevation={3}>
          <Typography
            variant="h6"
            align="center"
            gutterBottom
            style={{ paddingTop: "10px"}}
          >
            Inputs
          </Typography>
          <svg id="input" style={{ height: "35vh" }} />
        </Paper>
      </Grid2>
      <Grid2>
        <Paper elevation={3} style={{ backgroundColor: "white" }}>
          <Typography
            variant="h6"
            align="center"
            gutterBottom
            style={{ paddingTop: "10px" }}
          >
            Outputs
          </Typography>
          <svg id="output" style={{ height: "35vh" }}></svg>
        </Paper>
      </Grid2>
    </div>
	)
};

export default CategoryScatterPlot;