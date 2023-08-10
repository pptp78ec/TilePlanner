namespace TilePlanner_Server_RESTAPI.ORM
{
    public interface IBasicItem
    {
        public string Id { get; set; }

        public Itemtype Itemtype { get; set; }
        
        public string Header { get; set; }

        public string Description { get; set; }

        public string ParentId { get; set; }

        public string CreatorId { get; set; }
    }
}
