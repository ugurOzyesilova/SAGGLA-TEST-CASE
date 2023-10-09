import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';
import "../styles/Graph.css"
import { AiOutlineExclamationCircle } from "react-icons/ai"

const BitcoinGraph = () => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://api-testnet.bybit.com/v5/market/kline', {
                    params: {
                        category: 'spot',
                        symbol: 'BTCUSDT',
                        interval: '60',
                        limit: 4,
                    },
                });

                if (Array.isArray(response.data.result.list)) {
                    setChartData(response.data.result.list.map(item => ({
                        time: new Date(parseInt(item[0])).toLocaleTimeString(),
                        price: parseFloat(item[4]),
                    })).reverse());
                } else {
                    console.error('Invalid data structure in API response:', response.data);
                }
                console.log(response.data.result.list)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


    return (
        <div className="Graph hour-chart">
            <h2 className='Graph__info'>Bitcoin Hourly Chart<span>4 Hours</span></h2>
            <div className='Graph__container'>
                <LineChart width={620} height={280} data={chartData} className='Graph__line-chart'>
                    <CartesianGrid strokeDasharray="5 5" />
                    <XAxis
                        dataKey="time"
                        tick={{ fill: '#efefef', fontSize: 14, dy: 15 }}
                        tickLine={{ stroke: 'gray', strokeWidth: 2 }}
                        axisLine={{ stroke: 'gray', strokeWidth: 2 }}
                        
                    />
                    <YAxis
                        domain={["auto", "auto"]}
                        tick={{ fill: '#efefef', fontSize: 14}}
                        tickLine={{ stroke: 'gray', strokeWidth: 2 }}
                        axisLine={{ stroke: 'gray', strokeWidth: 2 }}

                    />
                    <Tooltip  />
                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#ffc424"
                        strokeWidth={1}
                        dot={{ r: 5, fill: 'yellow' }}
                    />
                </LineChart>
            </div>
            <div className='warning'>
                <AiOutlineExclamationCircle className = "warning-icon"/>
                <p>The data is sourced from a test API, and the displayed prices may not be accurate.</p>

            </div>

        </div>
    );
};

export default BitcoinGraph;
