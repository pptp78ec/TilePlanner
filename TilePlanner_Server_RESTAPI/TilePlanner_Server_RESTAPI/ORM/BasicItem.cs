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

        public string Tag { get; set; }

        public int SizeX { get; set; }

        public int SizeY { get; set; }

        public string BackgroundColor { get; set; }

        public string BackgroundImage { get; set; }
    }
}
