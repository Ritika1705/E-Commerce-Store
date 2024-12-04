import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const getAnalyticsData = async() => {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    
    const salesData = await Order.aggregate([
        {
            $group: {
                _id: null,
                totalSales: {$sum: 1},
                totalAmount: {$sum: "$totalAmount"}
            }
        }
    ])

    const {totalSales, totalAmount} = salesData[0] || {totalSales: 0, totalAmount: 0};

    return {
        users: totalUsers,
        products: totalProducts,
        totalSales,
        totalAmount
    }
}

export const getDailySalesData = async(startDate, endDate) => {
    try{
        const dailySales = await Order.aggregate([
            {
                $match: {
                    createdAt: {$gte: startDate, $lte: endDate}
                }
            },
            {
                $group: {
                    _id: {$dateToString: {format: "%Y-%m-%d", date: "$createdAt"}},
                    totalSales: {$sum: 1},
                    totalAmount: {$sum: "$totalAmount"}
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]);
    
        const dateArray = getDatesInRange(startDate, endDate);
    
        return dateArray.map((date) => {
            const foundData = dailySales.find((data) => data._id === date);
    
            return{
                date,
                sales: foundData ? foundData.totalSales : 0,
                revenue: foundData ? foundData.totalAmount : 0
            }
        });
    }
    catch(error){
        throw error;
    }
}

function getDatesInRange(startDate, endDate){
    const dates = [];
    let currentDate = new Date(startDate);

    while(currentDate <= endDate){
        dates.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}