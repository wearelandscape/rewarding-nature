import React from 'react'
import * as d3 from 'd3'

class DealProgress extends React.Component {
  state = {
    usData: null,
    usCongress: null
  }

  componentDidMount() {
    // load data
    this.update()
  }

  componentDidUpdate() {
    this.update()
  }

  update() {
    // render example D3
    const { data, width, height } = this.props
    if (data == null) return

    const series = d3.stack().keys(data.labels)(data.values)

    const svg = d3.select(this.anchor)
    const margin = { top: 20, right: 30, bottom: 30, left: 60 }

    function stackMin(serie) {
      return d3.min(serie, function(d) {
        return d[0]
      })
    }

    function stackMax(serie) {
      return d3.max(serie, function(d) {
        return d[1]
      })
    }

    const x = d3
      .scaleBand()
      .domain(
        data.values.map(function(d) {
          return d.month
        })
      )
      .rangeRound([margin.left, width - margin.right])
      .padding(0.1)

    const y = d3
      .scaleLinear()
      .domain([d3.min(series, stackMin), d3.max(series, stackMax)])
      .rangeRound([height - margin.bottom, margin.top])

    const z = d3.scaleOrdinal(d3.schemeCategory10)

    svg
      .append('g')
      .selectAll('g')
      .data(series)
      .enter()
      .append('g')
      .attr('fill', function(d) {
        return z(d.key)
      })
      .selectAll('rect')
      .data(function(d) {
        return d
      })
      .enter()
      .append('rect')
      .attr('width', x.bandwidth)
      .attr('x', function(d) {
        return x(d.data.month)
      })
      .attr('y', function(d) {
        return y(d[1])
      })
      .attr('height', function(d) {
        return y(d[0]) - y(d[1])
      })

    svg
      .append('g')
      .attr('transform', 'translate(0,' + y(0) + ')')
      .call(d3.axisBottom(x))

    svg
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',0)')
      .call(d3.axisLeft(y))
  }

  render() {
    const { data } = this.props

    if (data == null) {
      return null
    }

    return (
      <svg
        style={{ height: '100%', width: '100%' }}
        ref={node => (this.anchor = node)}
      />
    )
  }
}

export default DealProgress
