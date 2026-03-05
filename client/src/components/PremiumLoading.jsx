/**
 * Premium Loading Component with animated gradients
 */

const PremiumLoading = ({ message = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center h-full min-h-[500px]">
      <div className="text-center">
        {/* Animated Ring Loader */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          {/* Outer Ring */}
          <div className="absolute inset-0 border-8 border-transparent rounded-full animate-spin" style={{ borderTopColor: '#FF71CE', borderRightColor: '#01CDFE' }}></div>
          {/* Middle Ring */}
          <div className="absolute inset-2 border-8 border-transparent rounded-full animate-spin" style={{ borderTopColor: '#B967FF', borderRightColor: '#05FFA1', animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          {/* Inner Ring */}
          <div className="absolute inset-4 border-8 border-transparent rounded-full animate-spin" style={{ borderTopColor: '#01CDFE', borderRightColor: '#FF71CE', animationDuration: '2s' }}></div>
          {/* Center Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl animate-pulse">✨</span>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-vaporwave animate-pulse">
            {message}
          </h3>
          
          {/* Animated Dots */}
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: '#FF71CE', animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: '#01CDFE', animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: '#B967FF', animationDelay: '300ms' }}></div>
          </div>

          {/* Loading Bar */}
          <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
            <div className="h-full animate-shimmer" style={{ background: 'linear-gradient(90deg, #FF71CE, #01CDFE, #B967FF, #05FFA1)' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumLoading;
