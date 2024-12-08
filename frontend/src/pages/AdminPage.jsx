import React, { useEffect } from 'react'
import { BarChart, PlusCircle, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import CreateProductForm from '../components/CreateProductForm.jsx';
import AnalyticsTab from '../components/AnalyticsTab.jsx';
import ProductsList from '../components/ProductsList.jsx';
import { useProductStore } from '../stores/useProductStore.js';


const tabs = [
    {id: "create", name: "Create Product", icon: PlusCircle},
    {id: "orders", name: "Orders", icon: ShoppingCart},
    {id: "analytics", name: "Analytics", icon: BarChart}
];

const AdminPage = () => {

  const[activeTab, setActiveTab] = useState("create");
  const {fetchAllProducts} = useProductStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  return (
    <div className='min-h-screen overflow-hidden relative'>
        <div className='relative z-10 container mx-auto px-4 py-16'>
            <motion.h1
                className='text-4xl font-bold mb-8 text-emerald-400 text-center'
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y:0}}
                transition={{duration: 0.8}}
            >
                Admin Dashboard
            </motion.h1>

            <div className='flex justify-center mb-8'>
                {
                    tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 ${
                                activeTab === tab.id
                                ? "bg-emerald-600 text-white"
                                : "bg-gray-700 text-gray-400"
                            }`}
                        >
                            <tab.icon size={20} className='mr-2 h-5 w-5'/>
                            {tab.name}
                        </button>
                    )
                )}
            </div>

            {activeTab === "create" && <CreateProductForm/>}
            {activeTab === "orders" && <ProductsList/>}
            {activeTab === "analytics" && <AnalyticsTab />}
        </div>
    </div>
  )
}

export default AdminPage