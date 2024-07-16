// app/routes/company/loading.tsx
import React from "react";
const Loading: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b bg-primary">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-secondary"></div>
    </div>
  );
};

export default Loading;
