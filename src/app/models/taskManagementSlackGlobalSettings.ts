export class TaskManagementSlackGlobalSettings
{
id?:number;   
isNotifyOnTaskCreationGlobal:boolean;
notifyToUserOnTaskCreationGlobal:string;
isNotifyOnDueDayGlobal:boolean;
notifyToUserOnDueDayGlobal:string;
isNotifyAfterDueDayGlobal:boolean;
afterDueDayGlobal:string;
notifyToUserAfterDueDayGlobal:string;
isSendDailySummaryGlobal:boolean;
sendDailySummaryAtGlobal:string;
sendDailySummaryOnDaysGlobal:string;
epicUser:string;
notes:string;

constructor(id:number,isNotifyOnTaskCreationGlobal:boolean,notifyToUserOnTaskCreationGlobal:string,isNotifyOnDueDayGlobal:boolean,notifyToUserOnDueDayGlobal:string,
    isNotifyAfterDueDayGlobal:boolean,afterDueDayGlobal:string,notifyToUserAfterDueDayGlobal:string,isSendDailySummaryGlobal:boolean,sendDailySummaryAtGlobal:string,
    sendDailySummaryOnDaysGlobal:string,epicUser:string,notes:string)
{
    this.id=id;   
    this.isNotifyOnTaskCreationGlobal=isNotifyOnTaskCreationGlobal;
    this.notifyToUserOnTaskCreationGlobal=notifyToUserOnTaskCreationGlobal;
    this.isNotifyOnDueDayGlobal=isNotifyOnDueDayGlobal;
    this.notifyToUserOnDueDayGlobal=notifyToUserOnDueDayGlobal;
    this.isNotifyAfterDueDayGlobal=isNotifyAfterDueDayGlobal;
    this.afterDueDayGlobal=afterDueDayGlobal;
    this.notifyToUserAfterDueDayGlobal=notifyToUserAfterDueDayGlobal;
    this.isSendDailySummaryGlobal=isSendDailySummaryGlobal;
    this.sendDailySummaryAtGlobal=sendDailySummaryAtGlobal;
    this.sendDailySummaryOnDaysGlobal=sendDailySummaryOnDaysGlobal;
    this.epicUser=epicUser;
    this.notes=notes;
}

}

export class TaskManagementApplyFilter
{
    public  assignedBy: string;
    public  assignedTo: string;
    public  dueDate: string;
    public  label: string;
    public  status: string;
    public  userId: string;

    constructor(assignedBy:string,assignedTo:string,dueDate:string,label:string,status:string,userId:string)
    { 
       this.assignedBy=assignedBy;
       this.assignedTo=assignedTo;
       this.dueDate=dueDate;
       this.label=label;
       this.status=status;
       this.userId=userId;
    }

}

export class TaskManagementArray
{
    public  DueDate: string;
    public  IsArchived: boolean;
    public  IsCompleted: boolean;
    public  Tag: string;
    public  TaskAssignBy: string;
    public  TaskAssignBy2: string;
    public  TaskAssignTo: string;
    public  TaskAssignTo2: string;
    public  TaskId: number;
    public  TaskSpecifics: string;
    public  TaskTitle: string;
}
    