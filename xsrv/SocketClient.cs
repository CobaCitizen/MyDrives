using System;
using System.Net.WebSockets;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace xsrv
{
	public class SocketClient
	{
		public delegate void EventSocketExecuteResult(bool result);

		static public void CreateSocketThread(HttpListenerContext context){
			Task.Factory.StartNew(() =>
				{
					SocketClient client = new SocketClient();
					client.Execute(context,(result)=>{});
				},TaskCreationOptions.LongRunning);
			
		}
		WebSocket _ws =null;
		public SocketClient (){
			
		}
		public async void Read(){
			var buffer = new byte[1024];
			var segment = new ArraySegment<byte>(buffer);
			await _ws.ReceiveAsync (segment, CancellationToken.None);

		}
		public async void Execute(HttpListenerContext context, EventSocketExecuteResult callback){
				WebSocketContext webSocketContext = await context.AcceptWebSocketAsync(null);
			_ws = webSocketContext.WebSocket;
				for (int i = 0; i != 10; ++i)
				{
					// await Task.Delay(20);
					var time = DateTime.Now.ToLongTimeString();
					var buffer = Encoding.UTF8.GetBytes(time);
					var segment = new ArraySegment<byte>(buffer);
				await _ws.SendAsync(segment, System.Net.WebSockets.WebSocketMessageType.Text,
						true, CancellationToken.None);
				}
		
			if (callback!=null) {
				callback (true);
			}
	//	await ws.CloseAsync(WebSocketCloseStatus.NormalClosure, "Done", CancellationToken.None);
		}
	}
}

