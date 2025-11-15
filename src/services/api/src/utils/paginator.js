/**
 * Pagination Utility
 */

exports.getPaginationParams = (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return { skip, limit };
};

exports.formatPaginatedResponse = (data, page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    pagination: {
      currentPage: page,
      totalPages,
      limit,
      total,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};
