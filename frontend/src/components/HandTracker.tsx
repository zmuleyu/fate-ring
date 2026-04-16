import type { HandGestureState, GestureType } from '../hooks/useHandGesture'
import './HandTracker.css'

interface HandTrackerProps {
  state: HandGestureState
}

const GESTURE_LABELS: Record<NonNullable<GestureType>, string> = {
  'pinch': '✦ 捏合',
  'open':  '✋ 张开',
}

const GUIDE_ITEMS = [
  {
    icon: '↔',
    gesture: '手掌左右平移',
    action: '连续旋转牌阵',
    tip: '掌心朝摄像头，整只手横向移动；移动快慢决定转速，松开后惯性滑动',
  },
  {
    icon: '✦',
    gesture: '拇指与食指捏合',
    action: '选中当前牌',
    tip: '两指尖相距 < 2cm 触发，短暂捏合即可，无需保持',
  },
  {
    icon: '✋',
    gesture: '五指完全张开',
    action: '重置所有选牌',
    tip: '手指伸直展开，掌心朝摄像头，保持 0.5s',
  },
]

export default function HandTracker({ state }: HandTrackerProps) {
  const { isEnabled, cameraReady, cameraError, gesture, enable, disable, videoRef, canvasRef } = state

  return (
    <div className="hand-tracker">
      {/* Toggle button */}
      <button
        className={`hand-tracker-toggle ${isEnabled ? 'hand-tracker-toggle--active' : ''}`}
        onClick={isEnabled ? disable : enable}
        title={isEnabled ? '关闭手势' : '开启手势识别'}
      >
        {isEnabled ? '🤚 关闭手势' : '🤚 手势控制'}
      </button>

      {isEnabled && (
        <div className="hand-tracker-window">
          {/* Header */}
          <div className="hand-tracker-header">
            <span className="hand-tracker-title">手势识别</span>
            <span className={`hand-tracker-status ${cameraReady ? 'hand-tracker-status--ready' : ''}`}>
              {cameraReady ? '● 运行中' : '● 初始化...'}
            </span>
          </div>

          {/* Camera preview (always mounted so stream can start) */}
          <div className={`hand-tracker-preview ${!cameraReady ? 'hand-tracker-preview--loading' : ''}`}>
            <video ref={videoRef} className="hand-tracker-video" autoPlay playsInline muted />
            <canvas ref={canvasRef} className="hand-tracker-canvas" />

            {/* Loading overlay — shows guide while model downloads */}
            {!cameraReady && !cameraError && (
              <div className="hand-tracker-loading-overlay">
                <div className="ht-spinner" />
                <p className="ht-loading-text">正在加载手势模型…</p>
                <p className="ht-loading-sub">首次约 10s，请保持网络畅通</p>
              </div>
            )}

            {/* Gesture flash */}
            {gesture && (
              <div className="hand-tracker-gesture-flash">
                {GESTURE_LABELS[gesture]}
              </div>
            )}
          </div>

          {/* Camera error */}
          {cameraError && (
            <div className="hand-tracker-error">
              摄像头不可用，已切换鼠标模式
            </div>
          )}

          {/* Gesture guide — always visible */}
          <div className="hand-tracker-guide">
            <div className="ht-guide-title">手势操作指南</div>
            {GUIDE_ITEMS.map((item) => (
              <div key={item.gesture} className="ht-guide-row">
                <div className="ht-guide-icon">{item.icon}</div>
                <div className="ht-guide-body">
                  <div className="ht-guide-gesture">{item.gesture}</div>
                  <div className="ht-guide-action">→ {item.action}</div>
                  <div className="ht-guide-tip">{item.tip}</div>
                </div>
              </div>
            ))}
            <div className="ht-guide-notes">
              <p>· 确保手部在画面中央，光线充足</p>
              <p>· 置信度不足时手势自动忽略</p>
              <p>· 鼠标/触控操作仍然有效</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
