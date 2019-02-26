<template>
  <b-card class="chart">
    <div slot="header">
      Question: {{ summary.value }}
      <span v-if="summary.type === 'CHOICE'"
            class="chart__type">
        Choice
      </span>
      <span v-if="summary.type === 'LIKE'"
            class="chart__type">
        like
      </span>
      <span v-if="summary.type === 'LIKEDISLIKE'"
            class="chart__type">
        Like and Dislike
      </span>
      <span v-if="summary.type === 'REGULATOR'"
            class="chart__type">
        Regulator
      </span>
      <span v-if="summary.type === 'FAVORITE'"
            class="chart__type">
        Favorite
      </span>
      <span v-if="summary.type === 'RANKING'"
            class="chart__type">
        Ranking
      </span>
    </div>
    <svg :id="`question-chart-${summary.question}`"
         :width="width"
         :height="height" />
  </b-card>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'Chart',
  props: {
    summary: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      width: 400,
      height: 200,
      styles: {
        padding: {
          left: 25,
        },
      },
    }
  },
  watch: {
    '$route' (to, from) {
      this.onResize()
    }
  },
  mounted() {
    
    window.addEventListener('resize', this.onResize)

    this.setup()

    // append g to svg 
    this.svg = d3.select(`#question-chart-${this.summary.question}`)
      .append('g')
      .attr('transform', 'translate(60, 0)')

    // get y axis
    const y = d3.scaleBand()
      .range([this.innerHeight, 0])
      .padding(0.4)

    // get x axis
    const x = d3.scaleLinear()
      .range([0, this.innerWidth])
    
    // set domain for x and y axis
    x.domain([0, d3.max(this.summary.evaluations[0].data, d => d.total)])
    y.domain(this.summary.evaluations[0].data.map(d => d.label))    

    // append bars to chart
    this.svg.selectAll('.bar')
      .data(this.summary.evaluations[0].data)
      .enter()
      .append('rect')
      .attr('width', d => x(d.total))
      .attr('y', d => y(d.label))
      .attr('class', d => {
        
        if (d.total === d3.max(this.summary.evaluations[0].data, v => v.total)) {
          return 'max bar'
        }
        return 'bar'
      })
      .attr('transform', `translate(${this.styles.padding.left}, 0)`)
      .attr('height', y.bandwidth())

    // add the x axis
    this.svg.append('g')
      .attr('class', 'x')
      .attr('transform', `translate(${this.styles.padding.left}, ${this.innerHeight})`)
      .call(d3.axisBottom(x))

    // add the y axis
    this.svg.append('g')
      .attr('class', 'y')
      .attr('transform', `translate(${this.styles.padding.left}, 0)`)
      .call(d3.axisLeft(y))

  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    setup() {
      // get root element (.chart)
      const element = document.querySelector('.chart .card-body')

      // get padding from .chart styles in px
      const styles = element.currentStyle || window.getComputedStyle(element)
      const padding = parseInt(styles.paddingLeft.replace('px', '', 10))
      
      // set width to .chart width without padding (if not visible or to small we assume a default value of 200px)
      if (element.getBoundingClientRect().width >= 200) {
        this.width = element.getBoundingClientRect().width - (padding * 2)
      } else {
        this.width = 200
      }      

      // set height to length * 50px guess (30px = guessed height of x axis)
      this.height = this.summary.evaluations[0].data.length * 50 + 30 

      // innerHeight = height without x axis
      this.innerHeight = this.summary.evaluations[0].data.length * 50

      // innerWidth = width without half the label width
      this.innerWidth = this.width - 75 - this.styles.padding.left
      
      // innerHeight = height without x axis
      this.innerHeight = this.summary.evaluations[0].data.length * 50

      // innerWidth = width without half the label width + padding
      this.innerWidth = this.width - (75 + this.styles.padding.left)
    },
    onResize() {

      this.setup()
      
      // get y axis
      var y = d3.scaleBand()
        .range([this.innerHeight, 0])
        .padding(0.4)

      // get x axis
      var x = d3.scaleLinear()
        .range([0, this.innerWidth])
              
      // set domain for x and y axis (0 to max value)
      x.domain([0, d3.max(this.summary.evaluations[0].data, d => d.total)])
      y.domain(this.summary.evaluations[0].data.map(d => d.label))
      
      // append bars to chart
      this.svg.selectAll('.bar')
        .data(this.summary.evaluations[0].data)
        .attr('width', d => x(d.total))
        .attr('y', d => y(d.label))
        .attr('height', y.bandwidth())
        .enter()

      // update x axis
      this.svg.select('.x')
        .call(d3.axisBottom(x))
      
      // update y axis
      this.svg.select('.y')
        .call(d3.axisLeft(y))
    },
  },
}
</script>

<style lang="scss">
  /* we dont used scoped values for visualisations because of d3 dom manipulation */

  .visualisation .chart:last-child { margin-bottom: 0; }

  .chart {
    border: $inputBorder;
    margin-bottom: $marginDefault;

    .chart__type {
      text-transform: capitalize;
      font-size: 0.8rem;
      border: $inputBorder;
      padding: 3px 6px;
      background-color: #FFFFFF;
      border-radius: 0.25rem;
    }

    .card-header div {
      padding: 0.75rem 1rem;
      background-color: $backgroundColor;
      border-bottom: $inputBorder;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .bar {
      fill: $secondaryColor;

      &.max {
        fill: $primaryColor;
      }
    }
  }

  @media print {
    .chart .bar.max {
      fill: $primaryColorPrint !important;
    }

    .chart {
      page-break-after: always;
    }
  }
</style>
