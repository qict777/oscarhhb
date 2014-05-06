#coding=utf8
import re,urllib2,os,smtplib,time
from time import localtime,strftime
from email.mime.text import MIMEText

# 发件人邮箱用户名
username = "qictang@163.com"

# 发件人邮箱密码
password = "qict2006"

# 发件人邮箱smtp服务器
mailserver = "smtp.163.com"

# 发件人邮箱smtp服务器端口号
#port = "465"

# 邮件主题
subject2 = '监控主机广域网IP变更通知'

# 执行间隔，单位秒
interval = 300

# 发件地址
from_addr = "qictang@163.com"

# 收件地址
to_addr = "seven_qi@foxmail.com"

# 是否打开debug ( 0关闭，1打开)
debuglevel = 0



class Getmyip:
    def getip(self):
        try:
            myip = self.visit("http://www.ip138.com/ip2city.asp")
        except:
            try:
                myip = self.visit("http://www.bliao.com/ip.phtml")
            except:
                try:
                    myip = self.visit("http://www.whereismyip.com/")
                except:
                    myip = "So sorry!!!"
        return myip
    def visit(self,url):
        opener = urllib2.urlopen(url)
        if url == opener.geturl():
            str = opener.read()
        return re.search('\d+\.\d+\.\d+\.\d+',str).group(0)
getmyip = Getmyip()
localip = getmyip.getip()
lastip = "0.0.0.0"
def mailsend():
    global lastip
    if localip <> lastip:
        lastip = localip
        now = strftime("%Y-%m-%d %H:%M:%S",localtime())
        subject = now + " 当前外网IP地址为: " + localip
        msg = MIMEText('<html><h1>'+ subject +'</h1></html>','html','utf-8')  
        msg['Subject'] = subject2
        smtp = smtplib.SMTP()
        #smtp.set_debuglevel(debuglevel)
        smtp.connect(mailserver)
        smtp.login(username, password)
        smtp.sendmail(from_addr,to_addr,msg.as_string())    
        smtp.quit()        
    else:
        now2 = strftime("%Y-%m-%d %H:%M:%S",localtime())
        print now2 + " : "+ lastip
    time.sleep(interval)
    mailsend()
mailsend()
print '脚本出现异常'