import { Button, Box, TextField } from "@mui/material";
import { Theme } from "@emotion/react";

interface CategoryFiltersProps {
	category: string;
	theme: Theme;
	updateFilter: (category: string, bound: string, val: number) => void;
	flipEnabledCategory: (category: string) => void;
	flipEnabledFilter: (category: string) => void;
	categoryEnabled: boolean;
	filterEnabled: boolean;
	range: number[];
}

function CategoryFilters(
	{category, updateFilter, flipEnabledCategory, flipEnabledFilter, categoryEnabled, filterEnabled, range} : CategoryFiltersProps) {

	return (
		<Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
				margin: "5px",
				gap: 0.5,
      }}
    >
			{/* Category Enable/Disable Button */}
      <Button
				onClick={() => flipEnabledCategory(category) }
        variant="contained"
        sx={{
					width: "10vw",
					height: "6vh",
          padding: "4px",
          borderRadius: "5px",
          textTransform: "none",
          fontSize: "13px",
					backgroundColor: categoryEnabled ? "rgb(39, 31, 255)" : "rgb(124, 37, 255)",
          color: "white",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
					border: "1px solid white",
          transition: "0.3s",
          "&:hover": {
            transform: 'scale(1.05)',
          },
          "&:active": {
            boxShadow: "none",
            transform: "scale(0.95)",
          },
        }}
      >
				{category}
      </Button>

			{/* Filter Range Input */}
			{filterEnabled && categoryEnabled &&
				<div style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
				}}>
				<TextField
					onChange={
						(event) => {
							const value = event.target.value;
							const newValue = value === '' ? 0 : parseInt(value);
							updateFilter(category, "min", newValue);
						}
					}
					size="small"
					label="min"
					variant="outlined"
					fullWidth={false}
					value={range[0] == 0 ? "" : range[0]}
					InputLabelProps={{
						style: { color: "white" },
					}}
					sx={{
						width: "60px",
						"& .MuiOutlinedInput-root": {
							borderRadius: "12px",
							transition: "0.3s",
              "& input": {
								color: "white",
                padding: "10px",
                fontSize: "14px",
              },
							"fieldset": { borderColor: "white" },
							"&:hover fieldset": { borderColor: "white" },
							"&.Mui-focused fieldset": { borderColor: "white" },
						},
					}}
				/>

				<div style={{color: "white", margin: "10px"}}> to </div>

				<TextField
					onChange={
						(event) => {
							const value = event.target.value;
							const newValue = value === "" ? Infinity : parseInt(value);
							updateFilter(category, "max", newValue);
						}
					}
					size="small"
					label="max"
					variant="outlined"
					fullWidth={false}
					value={range[1] == Infinity ? "" : range[1]}
					InputLabelProps={{
						style: { color: "white" },
					}}
					sx={{
						width: "60px",
						"& .MuiOutlinedInput-root": {
							borderRadius: "12px",
							transition: "0.3s",
              "& input": {
								color: "white",
                padding: "10px",
                fontSize: "14px",
              },
							"fieldset": { borderColor: "white" },
							"&:hover fieldset": { borderColor: "white" },
							"&.Mui-focused fieldset": { borderColor: "white" },
						},
					}}
				/>
			</div>}

			{/* Filter Enable/Disable Button */}
			<Button
				onClick={() => flipEnabledFilter(category) }
				variant="contained"
				sx={{
					width: "8vw",
					padding: "0px",
					textTransform: "none",
					fontSize: "12px",
					backgroundColor: filterEnabled && categoryEnabled ?  "rgb(0, 162, 255)" : "rgb(186, 64, 197)",
					color: "white",
					border: "1px solid white",
					boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
					transition: "0.3s",
					"&:hover": {
						transform: "scale(1.05)",
					},
					"&:active": {
						boxShadow: "none",
						transform: "scale(0.95)",
					},
				}}
			>
				{
					filterEnabled && categoryEnabled ? "Filter Enabled" : "Filter Disabled"
				}
			</Button>
    </Box>
	)
};

export default CategoryFilters;