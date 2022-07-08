const METRICS_AGG = {
  mean: "$avg",
  min: "$min",
  max: "$max",
}
const defaultOpts = {
  filters: {},
  groups: [],
  metrics: ["mean", "min", "max"],
}

const dolarPrefix = (val) => `$${val}`

const metricFields = (columns, metrics) => {
  return columns.reduce((acc, column) => {
    metrics.forEach((metric) => {
      acc[`${column}_${metric}`] = { [METRICS_AGG[metric]]: dolarPrefix(column) }
    })

    return acc
  }, {})
}

exports.Statistics = {
  async summary(dbModel, columns, opts = {}) {
    const { filters, groups, metrics } = { ...defaultOpts, ...opts }

    return await dbModel.aggregate([
      { $match: filters },
      { $group: { _id: groups.map(dolarPrefix), ...metricFields(columns, metrics) } },
    ])
  },
}
