'use client'
import { Bar, Bubble, Doughnut, Line, Pie, PolarArea, Radar } from 'react-chartjs-2';
import { IProductData } from "@/types/product";

const ProductChartsSection: React.FC<{products: IProductData[]}> = ({ products }) => {
    const filteredProducts = products.filter((product) => product.price < 5000 && product.price > 100);
    const radarFilteredProducts = products.filter((product) => product.price < 5000 && product.price >= 500);

    const chartData = {
        labels: filteredProducts.map(product => product.name),
        datasets: [
            {
                label: 'Price',
                data: filteredProducts.map(product => product.price),
                backgroundColor: [
                    '#60A5FA', '#34D399', '#F87171', '#FBBF24', '#A78BFA', '#F472B6',
                    '#4ADE80', '#FCD34D', '#C084FC', '#38BDF8', '#FB923C', '#F472B6'
                ],
                borderWidth: 1,
                fill: true
            },
        ],
    };

    const areaChartData = {
        labels: filteredProducts.map(product => product.name),
        datasets: [
            {
                label: 'Price',
                data: filteredProducts.map(product => product.price),
                backgroundColor: "rgba(34,34,192,0.4)",
                borderWidth: 1,
                fill: true
            },
        ],
    };

    const radarChartData = {
        labels: radarFilteredProducts,
        datasets: [
            {
                label: 'Price',
                data: radarFilteredProducts.map(product => product.price),
                backgroundColor: 'rgba(34, 197, 94, 0.3)',
                borderColor: 'rgba(34, 197, 94, 1)',
                pointBackgroundColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 1,
                fill: true,
            },
        ],
    };

    const bubbleChartData = {
        datasets: [
            {
                label: 'Product Bubble',
                data: products.map((p, index) => ({
                    x: index,
                    y: p.price,
                    r: Math.max(5, Math.min(p.price / 1000, 20)),
                })),
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                borderColor: 'rgba(53, 162, 235, 1)',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    const radarChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            r: {
                angleLines: {
                    color: '#ddd',
                },
                grid: {
                    color: '#ccc',
                },
                pointLabels: {
                    color: '#333',
                },
                ticks: {
                    backdropColor: 'transparent',
                    color: '#666',
                },
            },
        },
    };

    const bubbleChartOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Bubble Chart - Product Price vs Index',
            },
        },
        scales: {
            x: {
                title: { display: true, text: 'Product Index' },
            },
            y: {
                title: { display: true, text: 'Price (Rs)' },
            },
        },
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4 text-center">Product Price Distribution</h2>
            <div className="flex justify-center flex-wrap-reverse gap-6 my-6">
                <div className="w-72 h-72">
                    <Pie data={chartData} options={chartOptions} />
                </div>
                <div className="w-[500px] h-72">
                    <Line data={areaChartData} options={chartOptions} />
                </div>
                <div className="w-[500px] h-72">
                    <Bar data={chartData} options={chartOptions} />
                </div>
                <div className="w-[500px] h-72">
                    <Radar data={radarChartData} options={radarChartOptions} />
                </div>
                <div className="w-[500px] h-72">
                    <PolarArea data={chartData} options={chartOptions} />
                </div>
                <div className="w-[500px] h-72">
                    <Bubble data={bubbleChartData} options={bubbleChartOptions} />
                </div>
                <div className="w-[500px] h-72">
                    <Doughnut data={chartData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
};

export default ProductChartsSection;