"use client";

import { IOrderQty } from "@/hooks/useProductFetch";
import {
    dualAxisOptions,
    getCategoryData,
    getOrderAnalysisData,
    getPriceRangeData,
    pieChartOptions,
} from "@components/Functions";
import { IProductData } from "@types";
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from "chart.js";
import { Layers, Package, Store, Tag } from "lucide-react";
import { JSX } from "react";
import { Bar, Doughnut, Pie } from "react-chartjs-2";
import CountUp from "react-countup";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

export const ProductChartsSection: React.FC<{
  products: IProductData[];
  orders?: IOrderQty[];
}> = ({ products, orders = [] }) => {
  const priceRangeData = getPriceRangeData(products);
  const categoryData = getCategoryData(products);
  const orderAnalysisData = getOrderAnalysisData(products, orders);

  const chartList: {
    title: string;
    count: number;
    bg?: string;
    icon?: JSX.Element;
    trend?: string;
    prefix?: string;
  }[] = [
    {
      title: "Active Products",
      count: products.length,
      bg: "from-blue-500 to-blue-600",
      icon: <Package className="w-5 h-5" />,
      trend: "+5%",
    },
    {
      title: "Avg Price",
      count:
        Math.round(
          products.reduce((sum, p) => sum + p.price, 0) / products.length
        ) || 0,
      bg: "from-green-500 to-green-600",
      prefix: "₹",
      icon: <Tag className="w-5 h-5" />,
      trend: "-2%",
    },
    {
      title: "Categories",
      count: new Set(
        products.flatMap((p) => p.categories?.map((c) => c.name) || [])
      ).size,
      bg: "from-purple-500 to-purple-600",
      icon: <Layers className="w-5 h-5" />,
      trend: "+1%",
    },
    {
      title: "Brands",
      count: new Set(
        products.flatMap((p) => p.brands?.map((b) => b.name) || [])
      ).size,
      bg: "from-orange-500 to-orange-600",
      icon: <Store className="w-5 h-5" />,
      trend: "+3%",
    },
  ];

  return (
    <div className="space-y-8 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {chartList.map(
          ({ title, count, bg, prefix = "", icon, trend }, index) => (
            <div
              key={index}
              className={`relative group bg-gradient-to-bl ${bg} rounded-3xl p-6 backdrop-blur-xl border border-white/20 shadow-lg  transition-all duration-300  overflow-hidden`}
            >
              <div className="absolute top-5 right-6 p-3 rounded-2xl bg-white/20 backdrop-blur-md shadow-md flex items-center justify-center">
                {icon}
              </div>
              <div className="text-white font-semibold text-3xl">{title}</div>
              <div className="pt-10">
                {trend && (
                  <div className="flex justify-butween w-full mb-2">
                    <div className="text-3xl font-extrabold text-white mb-2 tracking-tight">
                      {prefix}
                      <CountUp end={count} duration={1.5} separator="," />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Price Range Distribution
          </h3>
          <div className="h-80">
            <Doughnut data={priceRangeData} options={pieChartOptions} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Top Categories
          </h3>
          <div className="h-80">
            <Pie data={categoryData} options={pieChartOptions} />
          </div>
        </div>

        {orderAnalysisData && (
          <div className="bg-white p-6 rounded-xl shadow-lg lg:col-span-2">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Order Quantity vs Price Analysis
            </h3>
            <div className="h-80">
              <Bar data={orderAnalysisData} options={dualAxisOptions} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
