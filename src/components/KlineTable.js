import React, { useState, } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip} from 'recharts';
import "../styles/KlineTable.css"
import { MdCurrencyBitcoin } from "react-icons/md"


function KlineDataDisplay({theme}) {

    const [klineData, setKlineData] = useState([]);
    const [currentTimes, setCurrentTimes] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [isChartDataAvailable, setIsChartDataAvailable] = useState(false);

  
    const fetchKlineData = async () => {
        try {
            const response = await axios.get(
                'https://api-testnet.bybit.com/v5/market/kline',
                {
                    params: {
                        category: 'inverse',
                        symbol: 'BTCUSD',
                        interval: '1',
                        limit: '1'
                    },
                }
            );

            const newData = response.data.result.list[0]; 
            setKlineData((prevData) => [...prevData, ...response.data.result.list]);
            setCurrentTimes((prevTimes) => [...prevTimes, getCurrentTime()]);
            setChartData((prevChartData) => [
                ...prevChartData,
                {
                    timestamp: newData[0],
                    closePrice: newData[4]
                }
            ]);
            setIsChartDataAvailable(true);

        } catch (error) {
            console.error('Error fetching kline data:', error);
        }
    };

    const handleButtonClick = async () => {
        await fetchKlineData();
    };

    const formatTimestamp = (timestamp) => {
        try {
            const date = new Date(parseInt(timestamp));
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

            return formattedTime;
        } catch (error) {
            console.error('Error formatting timestamp:', error);
            return 'Invalid Timestamp';
        }
    };

    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const currentTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        return currentTime;
    };

    return (
        <div className="KlineTable">
            <div className="KlineTable-datas">
                <div className='KlineTable-fetch'>
                    <h2>Kline Data Table </h2>

                    <button onClick={handleButtonClick}>
                        <MdCurrencyBitcoin className="button-icon" />
                        <span>BTCPERP</span>
                    </button>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>CT</th>
                                <th>API ST</th>
                                <th>Open</th>
                                <th>High</th>
                                <th>Low</th>
                                <th>Close</th>
                                <th>Volume</th>
                                <th>Turnover</th>
                            </tr>
                        </thead>
                        <tbody>
                            {klineData.map((data, index) => (
                                <tr key={index}>
                                    <td>{formatTimestamp(data[0])}</td>
                                    <td>{currentTimes[index]}</td>
                                    <td>{data[1]}</td>
                                    <td>{data[2]}</td>
                                    <td>{data[3]}</td>
                                    <td>{data[4]}</td>
                                    <td>{data[5]}</td>
                                    <td>{data[6]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


            </div>

            {isChartDataAvailable ? (
                <div className='Bar-Chart'>
                    <BarChart width={620} height={200} data={chartData}>
                        <XAxis dataKey="timestamp" tickFormatter={formatTimestamp}
                            tick={{ fill: '#efefef', fontSize: 14, dy: 15 }}
                            tickLine={{ stroke: 'gray', strokeWidth: 2 }}
                            axisLine={{ stroke: 'gray', strokeWidth: 2 }} />
                        <YAxis domain={['dataMin', 'auto']}
                            tick={{ fill: '#efefef', fontSize: 14 }}
                            tickLine={{ stroke: 'gray', strokeWidth: 2 }}
                            axisLine={{ stroke: 'gray', strokeWidth: 2 }}
                        />
                        <Tooltip labelFormatter={(value) => `Timestamp: ${formatTimestamp(value)}`} formatter={(value) => `$${value}`} />
                        <Bar dataKey="closePrice" fill={theme === 'app-dark' ? '#ffc424' : '#efefef'} barSize={20} />
                    </BarChart>
                </div>
            ) : (
                    <div className="Bar-Chart-info">
                        <p >The chart will be generated in here dynamically based on the provided data.</p>
                </div>
                
            )}





        </div>
    );
}
export default KlineDataDisplay;