const EmptyState = ({ icon: Icon, title, description, action }) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6 text-slate-700">
                {Icon && <Icon size={40} />}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-8">{description}</p>
            {action && action}
        </div>
    );
};

export default EmptyState;
