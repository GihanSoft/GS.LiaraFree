namespace GS.LiaraFree.Main.Shared.Functional;

internal static class F
{
    extension<TIn, TOut>(TIn)
    {
        public static TOut operator >>(TIn input, Func<TIn, TOut> func) => func(input);
    }

    extension<TIn>(TIn)
    {
        public static TIn operator >>(TIn input, Action<TIn> func)
        {
            func(input);
            return input;
        }
    }
}
