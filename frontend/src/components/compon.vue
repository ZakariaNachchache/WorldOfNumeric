<!-- <template>
  <div>
    <canvas ref="pieChart"></canvas>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, onBeforeUnmount } from "vue";
import { Chart } from "chart.js";

export default defineComponent({
  name: "SalesPieChart",
  props: {
    categories: {
      type: Array,
      required: true,
    },
    salesData: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const pieChart = ref(null);
    let chartInstance = null; // Declare a variable to store the Chart instance

    onMounted(() => {
      const categoryLabels = props.categories.map((item) => item.category);
      const totalSales = props.salesData.map((item) => item.totalSales);

      // Create the chart and store the instance
      chartInstance = new Chart(pieChart.value, {
        type: "pie",
        data: {
          labels: categoryLabels,
          datasets: [
            {
              data: totalSales,
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
              ],
              hoverOffset: 4,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  const percentage = tooltipItem.raw.toFixed(2);
                  return `${
                    tooltipItem.label
                  }: $${tooltipItem.raw.toLocaleString()} (${percentage}%)`;
                },
              },
            },
          },
        },
      });
    });

    // Cleanup the chart instance when the component is unmounted
    onBeforeUnmount(() => {
      if (chartInstance) {
        chartInstance.destroy(); // Destroy the chart instance to free resources
      }
    });

    return { pieChart };
  },
});
</script>

<style scoped>
/* You can style the chart container as needed */
canvas {
  width: 100% !important;
  height: 400px;
}
</style> -->
