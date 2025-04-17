import React from "react";

const Pagination = ({ totalPages = 1, currentPage = 1, onPageChange }) => {
	const getPageNumbers = () => {
		const pageNumbers = [];
		const maxVisiblePages = 5;

		if (totalPages <= maxVisiblePages) {
			// Show all pages if total pages are less than or equal to maxVisiblePages
			for (let i = 1; i <= totalPages; i++) {
				pageNumbers.push(i);
			}
		} else {
			// Always show first page
			pageNumbers.push(1);

			// Calculate start and end of page range
			let startPage = Math.max(2, currentPage - 1);
			let endPage = Math.min(totalPages - 1, currentPage + 1);

			// Adjust to show 3 pages in the middle
			if (startPage === 2) endPage = Math.min(4, totalPages - 1);
			if (endPage === totalPages - 1) startPage = Math.max(2, totalPages - 3);

			// Add ellipsis after first page if needed
			if (startPage > 2) pageNumbers.push("...");

			// Add middle pages
			for (let i = startPage; i <= endPage; i++) {
				pageNumbers.push(i);
			}

			// Add ellipsis before last page if needed
			if (endPage < totalPages - 1) pageNumbers.push("...");

			// Always show last page
			pageNumbers.push(totalPages);
		}

		return pageNumbers;
	};

	const handlePrevious = (e) => {
		e.preventDefault(); // Prevent default to avoid navigation
		if (currentPage > 1) {
			onPageChange(currentPage - 1);
		}
	};

	const handleNext = (e) => {
		e.preventDefault(); // Prevent default to avoid navigation
		if (currentPage < totalPages) {
			onPageChange(currentPage + 1);
		}
	};

	const handlePageClick = (e, page) => {
		e.preventDefault(); // Prevent default to avoid navigation
		if (typeof page === "number") {
			onPageChange(page);
		}
	};

	const pageNumbers = getPageNumbers();

	return (
		<nav aria-label='Pagination'>
			<ul className='flex items-center -space-x-px h-10 text-base'>
				{/* Previous button */}
				<li>
					<button
						className={`flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg ${
							currentPage === 1
								? "opacity-50 cursor-not-allowed"
								: "hover:bg-gray-100 hover:text-gray-700"
						}`}
						onClick={handlePrevious}
						disabled={currentPage === 1}
						aria-disabled={currentPage === 1}>
						<span className='sr-only'>Previous</span>
						<svg
							className='w-3 h-3 rtl:rotate-180'
							aria-hidden='true'
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 6 10'>
							<path
								stroke='currentColor'
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								d='M5 1 1 5l4 4'
							/>
						</svg>
					</button>
				</li>

				{/* Page numbers */}
				{pageNumbers.map((page, index) => (
					<li key={index}>
						{page === "..." ? (
							<span className='flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300'>
								...
							</span>
						) : (
							<button
								aria-current={currentPage === page ? "page" : undefined}
								className={`flex items-center justify-center px-4 h-10 leading-tight ${
									currentPage === page
										? "z-10 text-[#435D63] border !border-[#435D63] bg-[#435D63]/10 hover:bg-[#435D63]/10 hover:text-[#435D63]"
										: "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
								}`}
								onClick={(e) => handlePageClick(e, page)}>
								{page}
							</button>
						)}
					</li>
				))}

				{/* Next button */}
				<li>
					<button
						className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg ${
							currentPage === totalPages
								? "opacity-50 cursor-not-allowed"
								: "hover:bg-gray-100 hover:text-gray-700"
						}`}
						onClick={handleNext}
						disabled={currentPage === totalPages}
						aria-disabled={currentPage === totalPages}>
						<span className='sr-only'>Next</span>
						<svg
							className='w-3 h-3 rtl:rotate-180'
							aria-hidden='true'
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 6 10'>
							<path
								stroke='currentColor'
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								d='m1 9 4-4-4-4'
							/>
						</svg>
					</button>
				</li>
			</ul>
		</nav>
	);
};

export default React.memo(Pagination);
