const formatDate = (dateString) => {
	if (!dateString) return "-";
	return new Date(dateString).toLocaleDateString(undefined, {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};



export default formatDate;
