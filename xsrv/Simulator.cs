using System;
using System.Runtime.InteropServices;
using System.Threading;
using System.Windows.Forms;
using System.Drawing;

namespace xsrv
{
	public class Simulator
	{
		public Simulator ()
		{
		}
		const uint MOUSEEVENTF_ABSOLUTE = 0x8000;
		const uint MOUSEEVENTF_LEFTDOWN = 0x0002;
		const uint MOUSEEVENTF_LEFTUP = 0x0004;
		const uint MOUSEEVENTF_MIDDLEDOWN = 0x0020;
		const uint MOUSEEVENTF_MIDDLEUP = 0x0040;
		const uint MOUSEEVENTF_MOVE = 0x0001;
		const uint MOUSEEVENTF_RIGHTDOWN = 0x0008;
		const uint MOUSEEVENTF_RIGHTUP = 0x0010;
		const uint MOUSEEVENTF_XDOWN = 0x0080;
		const uint MOUSEEVENTF_XUP = 0x0100;
		const uint MOUSEEVENTF_WHEEL = 0x0800;
		const uint MOUSEEVENTF_HWHEEL = 0x01000;
		[Flags]
		public enum MouseEventFlags : uint
		{
			LEFTDOWN   = 0x00000002,
			LEFTUP     = 0x00000004,
			MIDDLEDOWN = 0x00000020,
			MIDDLEUP   = 0x00000040,
			MOVE       = 0x00000001,
			ABSOLUTE   = 0x00008000,
			RIGHTDOWN  = 0x00000008,
			RIGHTUP    = 0x00000010,
			WHEEL      = 0x00000800,
			XDOWN      = 0x00000080,
			XUP    = 0x00000100
		}

		//Use the values of this enum for the 'dwData' parameter
		//to specify an X button when using MouseEventFlags.XDOWN or
		//MouseEventFlags.XUP for the dwFlags parameter.
		public enum MouseEventDataXButtons : uint
		{
			XBUTTON1   = 0x00000001,
			XBUTTON2   = 0x00000002
		}
		public struct POINT
		{
			public int X;
			public int Y;

			//public static implicit operator POINT(POINT point)
			//{
			//	return new Point(point.X, point.Y);
			//}
		}

		[DllImport("user32.dll", CharSet = CharSet.Auto, CallingConvention = CallingConvention.StdCall)]
		static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData,
			UIntPtr dwExtraInfo);
		//		[DllImport("user32.dll", CharSet = CharSet.Auto, CallingConvention = CallingConvention.StdCall)] 
		//		static extern bool SetCursorPos(int xPos, int yPos); 
		//		[DllImport("user32.dll", CharSet = CharSet.Auto, CallingConvention = CallingConvention.StdCall)]
		//		public static extern bool GetCursorPos(out POINT lpPoint);

		public static Point GetCursorPosition()
		{
			return System.Windows.Forms.Cursor.Position;
			//GetCursorPos(out lpPoint);
			//bool success = User32.GetCursorPos(out lpPoint);
			// if (!success)

			//return lpPoint;
		}
		static System.UIntPtr p = new UIntPtr();

		static public void MouseClick(){
			
				mouse_event (MOUSEEVENTF_LEFTDOWN, 0, 0, 0, p);
				//				Thread.Sleep (100);
				mouse_event (MOUSEEVENTF_LEFTUP, 0, 0, 0, p);
		}
		static public void MouseCursorMove(int x, int y){
			Point p = GetCursorPosition ();
			//		Console.WriteLine("cx: " + p.X + " cy: "+ p.Y + " x:" + x + " y:" + y);
			//SetCursorPos (p.X + x, p.Y + y);
			System.Windows.Forms.Cursor.Position = new Point(p.X + x, p.Y + y);
		//	Console.WriteLine("x " + x + " y " + y);
			//			const uint MOUSEEVENTF_MOVE=	0x0001;

		}
		//////
	    public static void LeftClick()
		{
			DoMouse( NativeMethods.MOUSEEVENTF.LEFTDOWN, new System.Drawing.Point( 0, 0 ) );
			DoMouse( NativeMethods.MOUSEEVENTF.LEFTUP, new System.Drawing.Point( 0, 0 ) );
		}

		public static void LeftClick( int x, int y )
		{
			DoMouse( NativeMethods.MOUSEEVENTF.MOVE | NativeMethods.MOUSEEVENTF.ABSOLUTE, new System.Drawing.Point( x, y ) );
			DoMouse( NativeMethods.MOUSEEVENTF.LEFTDOWN, new System.Drawing.Point( x, y ) );
			DoMouse( NativeMethods.MOUSEEVENTF.LEFTUP, new System.Drawing.Point( x, y ) );
		}

		public static void ClickBoundingRectangleByPercentage( int xPercentage, int yPercentage, System.Drawing.Rectangle bounds )
		{
			double additional = 0.0;
			if ( xPercentage == 99 )
				additional = 0.5;
			int xPixel = Convert.ToInt32( bounds.Left + bounds.Width * ( xPercentage + additional ) / 100 );
			int yPixel = Convert.ToInt32( bounds.Top + bounds.Height * ( yPercentage ) / 100 );
			LeftClick( xPixel, yPixel );
		}

		public static void RightClick()
		{
			DoMouse( NativeMethods.MOUSEEVENTF.RIGHTDOWN, new System.Drawing.Point( 0, 0 ) );
			DoMouse( NativeMethods.MOUSEEVENTF.RIGHTUP, new System.Drawing.Point( 0, 0 ) );
		}

		public static void RightClick( int x, int y )
		{
			DoMouse( NativeMethods.MOUSEEVENTF.MOVE | NativeMethods.MOUSEEVENTF.ABSOLUTE, new System.Drawing.Point( x, y ) );
			DoMouse( NativeMethods.MOUSEEVENTF.RIGHTDOWN, new System.Drawing.Point( x, y ) );
			DoMouse( NativeMethods.MOUSEEVENTF.RIGHTUP, new System.Drawing.Point( x, y ) );
		}

		public static void MoveMouse( Point p )
		{
			MoveMouse( p.X, p.Y );
		}

//		public static void MoveMouse( System.Drawing.Point p )
//		{
//			MoveMouse( Convert.ToInt32( p.X ), Convert.ToInt32( p.Y ) );
//		}

		public static void MoveMouse( int x, int y )
		{
			DoMouse( NativeMethods.MOUSEEVENTF.MOVE | NativeMethods.MOUSEEVENTF.ABSOLUTE, new System.Drawing.Point( x, y ) );
		}

		public static System.Drawing.Point GetMousePosition()
		{
			return Cursor.Position;
		}

		public static void ScrollWheel( int scrollSize )
		{
			DoMouse( NativeMethods.MOUSEEVENTF.WHEEL, new System.Drawing.Point( 0, 0 ), scrollSize );
		}

		private static void DoMouse( NativeMethods.MOUSEEVENTF flags, Point newPoint, int scrollSize = 0 )
		{
			NativeMethods.INPUT input = new NativeMethods.INPUT();
			NativeMethods.MOUSEINPUT mi = new NativeMethods.MOUSEINPUT();
			input.dwType = NativeMethods.InputType.Mouse;
			input.mi = mi;
			input.mi.dwExtraInfo = IntPtr.Zero;
			// mouse co-ords: top left is (0,0), bottom right is (65535, 65535)
			// convert screen co-ord to mouse co-ords...
			input.mi.dx = newPoint.X * 65535 / Screen.PrimaryScreen.Bounds.Width;
			input.mi.dy = newPoint.Y * 65535 / Screen.PrimaryScreen.Bounds.Height;
			input.mi.time = 0;
			input.mi.mouseData = scrollSize * 120;
			// can be used for WHEEL event see msdn
			input.mi.dwFlags = flags;
			int cbSize = Marshal.SizeOf( typeof ( NativeMethods.INPUT ) );
			int result = NativeMethods.SendInput( 1, ref input, cbSize );
//			if ( result == 0 )
//				Debug.WriteLine( Marshal.GetLastWin32Error() );
		}
	}//
}

