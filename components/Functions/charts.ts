import { ChartOptions, TooltipItem, ChartDataset } from 'chart.js';
import { IOrderQty } from "@/hooks/useProductFetch";
import { IProductData } from "@/types/product";
import { Layers, Package, Store, Tag } from "lucide-react";
import { JSX } from "react";
import { Bar, Doughnut, Pie } from "react-chartjs-2";
import CountUp from "react-countup";

export const getPriceRangeData = (products: IProductData[]) => {
    const ranges: Record<string, number> = {
        'Under ₹500': 0,
        '₹500-₹1000': 0,
        '₹1000-₹2500': 0,
        '₹2500-₹5000': 0,
        'Above ₹5000': 0,
    };

    products.forEach(product => {
        if (product.price < 500) ranges['Under ₹500']++;
        else if (product.price < 1000) ranges['₹500-₹1000']++;
        else if (product.price < 2500) ranges['₹1000-₹2500']++;
        else if (product.price < 5000) ranges['₹2500-₹5000']++;
        else ranges['Above ₹5000']++;
    });

    return {
        labels: Object.keys(ranges),
        datasets: [{
            label: 'Number of Products',
            data: Object.values(ranges),
            backgroundColor: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'],
            borderWidth: 2,
            borderColor: '#fff',
        }] as ChartDataset<'doughnut'>[],
    };
};


export const getCategoryData = (products: IProductData[]) => {
    const categoryCount: Record<string, number> = {};

    products.forEach(product => {
        product.categories?.forEach(category => {
            categoryCount[category.name] = (categoryCount[category.name] || 0) + 1;
        });
    });

    const sortedCategories = Object.entries(categoryCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 8);

    return {
        labels: sortedCategories.map(([name]) => name),
        datasets: [{
            label: 'Products per Category',
            data: sortedCategories.map(([, count]) => count),
            backgroundColor: [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
            ],
            borderWidth: 2,
            borderColor: '#fff',
        }] as ChartDataset<'pie'>[],
    };
};

export const getOrderAnalysisData = (products: IProductData[], orders?: IOrderQty[] | null) => {
    if (!orders?.length) return null;

    const orderMap = new Map(orders.map(order => [order.productId, order.totalQty]));
    const analysisData = products
        .filter(product => orderMap.has(product._id))
        .map(product => ({
            name: product.name.length > 20 ? product.name.substring(0, 20) + '...' : product.name,
            price: product.price,
            quantity: orderMap.get(product._id) || 0,
        }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 15);

    return {
        labels: analysisData.map(item => item.name),
        datasets: [
            {
                label: 'Order Quantity',
                data: analysisData.map(item => item.quantity),
                backgroundColor: 'rgba(34, 197, 94, 0.7)',
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 2,
                yAxisID: 'y',
            },
            {
                label: 'Price (₹)',
                data: analysisData.map(item => item.price),
                backgroundColor: 'rgba(239, 68, 68, 0.7)',
                borderColor: 'rgba(239, 68, 68, 1)',
                borderWidth: 2,
                yAxisID: 'y1',
            }
        ] as ChartDataset<'bar'>[],
    };
};

export const pieChartOptions: ChartOptions<'doughnut' | 'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                padding: 20,
                usePointStyle: true,
            }
        },
        tooltip: {
            callbacks: {
                label: (context: TooltipItem<'doughnut'>) => {
                    const total = context.dataset.data.reduce(
                        (a, b) => Number(a) + Number(b), 0
                    );
                    const percentage = ((context.parsed * 100) / total).toFixed(1);
                    return `${context.label}: ${context.parsed} (${percentage}%)`;
                }
            }
        }
    }
};

export const barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                stepSize: 1,
            }
        },
        x: {
            ticks: {
                maxRotation: 45,
            }
        }
    }
};

export const dualAxisOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
    },
    scales: {
        x: {
            ticks: {
                maxRotation: 45,
            }
        },
        y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
                display: true,
                text: 'Order Quantity'
            }
        },
        y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
                display: true,
                text: 'Price (₹)'
            },
            grid: {
                drawOnChartArea: false,
            },
        },
    },
};

