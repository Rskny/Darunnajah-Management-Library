import React from 'react';

interface TopUser {
  name: string;
  count: number;
  subText: string;
}

interface TopUsersListProps {
  title: string;
  data: TopUser[];
}

const TopUsersList: React.FC<TopUsersListProps> = ({ title, data }) => {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow flex flex-col justify-between">
      <div>
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
          <h3 className="text-sm font-bold text-slate-800 tracking-tight uppercase">{title}</h3>
        </div>

        <div className="space-y-4">
          {data && data.length > 0 ? (
            data.map((user, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-all duration-300 group"
              >
                <div className="flex items-center space-x-3">
                  {/* Nomor Urut / Rank */}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs border ${
                    index === 0 ? 'bg-amber-500 text-white border-amber-500' :
                    index === 1 ? 'bg-slate-300 text-slate-700 border-slate-300' :
                    'bg-slate-100 text-slate-600 border-transparent'
                  }`}>
                    {index + 1}
                  </div>
                  
                  <div>
                    <p className="font-semibold text-sm text-slate-800 group-hover:text-blue-600 transition-colors">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {user.subText}
                    </p>
                  </div>
                </div>

                {/* Total Aksi */}
                <div className="bg-slate-50 group-hover:bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">
                  <span className="text-xs font-bold text-slate-700">{user.count}x</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-xs text-slate-400 italic">
              Belum ada data bulan ini
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopUsersList;