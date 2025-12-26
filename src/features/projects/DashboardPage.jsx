import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { projectService } from '../../services/ProjectService';
import Card from '../../components/ui/Card';
import CardContent from '../../components/ui/CardContent';
import { AlertTriangle, BarChart, CalendarClock, CheckCircle2, ListTodo, PieChart } from 'lucide-react';
import { Bar, Cell, Legend, Pie, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import CardHeader from '../../components/ui/CardHeader';


// Bảng màu cho biểu đồ tròn
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const DashboardPage = () => {
  const { projectId } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      fetchStats();
    }
  }, [projectId]);

  const fetchStats = async () => {
    try {
      const data = await projectService.getStats(projectId);
      setStats(data);
    } catch (e) {
      console.error("Failed to load project stats", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Đang tải dữ liệu thống kê...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Không có dữ liệu thống kê.</div>
      </div>
    );
  }

  // Chuyển đổi dữ liệu từ object sang mảng để Recharts sử dụng
  const statusData = Object.keys(stats.tasksByStatus || {}).map(key => ({
    name: key,
    value: stats.tasksByStatus[key]
  }));

  const assigneeData = Object.keys(stats.tasksByAssignee || {}).map(key => ({
    name: key,
    tasks: stats.tasksByAssignee[key]
  }));

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-full">
      <h1 className="text-2xl font-bold text-gray-900">Tổng quan Dự án</h1>

      {/* --- PHẦN 1: CÁC THẺ SỐ LIỆU TỔNG QUAN (KPI CARDS) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Thẻ Tổng công việc */}
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Tổng công việc</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.totalTasks}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                <ListTodo size={24} />
            </div>
          </CardContent>
        </Card>

        {/* Thẻ Đã hoàn thành */}
        <Card className="border-l-4 border-l-green-500 shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Đã hoàn thành</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.completedTasks}</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full text-green-600">
                <CheckCircle2 size={24} />
            </div>
          </CardContent>
        </Card>

        {/* Thẻ Quá hạn */}
        <Card className="border-l-4 border-l-red-500 shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Đã quá hạn</p>
              <h3 className="text-3xl font-bold text-red-600 mt-1">{stats.overdueTasks}</h3>
            </div>
            <div className="bg-red-100 p-3 rounded-full text-red-600">
                <AlertTriangle size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- PHẦN 2: BIỂU ĐỒ (CHARTS) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Biểu đồ tròn: Trạng thái công việc */}
        <Card className="min-h-[400px] shadow-sm">
          <CardHeader className="border-b bg-white">
            <h3 className="font-bold text-gray-800 text-lg">Trạng thái công việc</h3>
          </CardHeader>
          <CardContent className="h-[350px] flex items-center justify-center p-4">
             {statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
             ) : (
               <div className="text-center text-gray-400">
                 <ListTodo size={48} className="mx-auto mb-2 opacity-20"/>
                 <p>Chưa có dữ liệu công việc</p>
               </div>
             )}
          </CardContent>
        </Card>

        {/* Biểu đồ cột: Năng suất thành viên */}
        <Card className="min-h-[400px] shadow-sm">
          <CardHeader className="border-b bg-white">
            <h3 className="font-bold text-gray-800 text-lg">Năng suất thành viên</h3>
          </CardHeader>
          <CardContent className="h-[350px] p-4">
             {assigneeData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={assigneeData} 
                    layout="vertical" 
                    margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                  >
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                    <Tooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    />
                    <Bar 
                      dataKey="tasks" 
                      name="Số lượng task" 
                      fill="#3b82f6" 
                      radius={[0, 4, 4, 0]} 
                      barSize={24} 
                    />
                  </BarChart>
                </ResponsiveContainer>
             ) : (
               <div className="flex flex-col items-center justify-center h-full text-gray-400">
                 <ListTodo size={48} className="mb-2 opacity-20"/>
                 <p>Chưa có dữ liệu thành viên</p>
               </div>
             )}
          </CardContent>
        </Card>
      </div>

      {/* --- PHẦN 3: DANH SÁCH CÔNG VIỆC QUÁ HẠN --- */}
      {stats.overdueTaskList && stats.overdueTaskList.length > 0 && (
          <Card className="border border-red-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-red-50 border-b border-red-100 py-4">
                  <h3 className="font-bold text-red-800 flex items-center gap-2 text-lg">
                      <CalendarClock size={24}/> Cảnh báo: Công việc quá hạn ({stats.overdueTaskList.length})
                  </h3>
              </CardHeader>
              <CardContent className="p-0">
                  <div className="divide-y divide-gray-100">
                      {stats.overdueTaskList.map(task => (
                          <div key={task.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-red-50/30 transition-colors">
                              <div className="flex items-center gap-3 mb-2 sm:mb-0">
                                  <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded border border-red-200 min-w-[70px] text-center">
                                    {task.displayId}
                                  </span>
                                  <span className="font-medium text-gray-800">{task.title}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-red-600 font-medium bg-red-50 px-3 py-1 rounded-full w-fit">
                                  <CalendarClock size={14} />
                                  <span>Hạn chót: {new Date(task.dueDate).toLocaleDateString('vi-VN')}</span>
                              </div>
                          </div>
                      ))}
                  </div>
              </CardContent>
          </Card>
      )}
    </div>
  );
}

export default DashboardPage