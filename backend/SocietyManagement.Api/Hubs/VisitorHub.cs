using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace SocietyManagement.Api.Hubs;

public class VisitorHub : Hub
{
    public async Task JoinFlatGroup(string flatId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"Flat_{flatId}");
    }

    public async Task LeaveFlatGroup(string flatId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"Flat_{flatId}");
    }
}
