#include <QCoreApplication>

#include <QFile>
#include <QTextStream>
#include <QDebug>
#include <QDate>

typedef struct tag_meeting_data{
    int id;
    QString baseName;
    QDate date;
    int numSpeeches;
    QString topic;
    QString pressRelease;
    QString outcome;
}MeetingData;

typedef struct tag_speech_data {
    int id;
    int speechIdx;
    QString country;
    QString speaker;
    QString participationType;
    QString roleInUN;
    int spv;
    QString baseName;
    QString topic;
    QDate date;
    QString fileName;
    int numTypes;
    int numTokens;
    int numSentences;
    int gender;
    QString topicKeyword;
}SpeechData;

typedef struct tag_raw_data {
    int id;
    QString fileName;
    QString text;
}RawData;


static void splitLineData(QString line, QStringList &list, QTextStream &in) {
    QStringList lineSplit;
    lineSplit = line.split(",");

    for(int i=0; i < lineSplit.size(); i++) {
        QString currString = lineSplit.at(i);

        if(currString.size() > 0 && currString.at(0) == "\"") {
            currString.count("\"");

            int countPara = currString.count("\"");
            while(true) {
                if(currString.at(currString.size()-1) == "\"") {
                    if(countPara%2 == 0) {
                        break;
                    }
                }

                if(i < lineSplit.size() - 1) {
                    i++;
                    QString appendString = lineSplit.at(i);
                    currString.append(",");
                    currString.append(appendString);
                    countPara += appendString.count("\"");
                }else {
                    QString appendString = in.readLine();
                    currString.append("\n");
                    currString.append(appendString);
                    countPara += appendString.count("\"");
                }
            }

            currString.remove(0, 1);
            currString.remove(currString.size()-1, 1);
        }
        list.append(currString);
    }
}

static void processRawData(QString line, RawData &data, QTextStream &in) {
    QStringList dataList;
    splitLineData(line, dataList, in);

    if(dataList.size() != 3) {
        qDebug() << dataList;
        return;
    }

    data.id = dataList.at(0).toInt();
    data.fileName = dataList.at(1);
    data.text = dataList.at(2);

    return;
}

static void processSpeechData(QString line, SpeechData &data, QTextStream &in) {
    QStringList dataList;
    splitLineData(line, dataList, in);

    if(dataList.size() != 19) {
        qDebug() << dataList;
        return;
    }

    data.id = dataList.at(0).toInt();
    data.speechIdx = dataList.at(1).toInt();
    data.country = dataList.at(2);
    data.speaker = dataList.at(3);
    data.participationType = dataList.at(4);
    data.roleInUN = dataList.at(5);
    data.spv = dataList.at(6).toInt();
    data.baseName = dataList.at(7);
    data.topic = dataList.at(8);
    data.date = QDate::fromString(dataList.at(9), "d MMMM yyyy");
    data.fileName = dataList.at(13);
    data.numTypes = dataList.at(14).toInt();
    data.numTokens = dataList.at(15).toInt();
    data.numSentences = dataList.at(16).toInt();
    data.gender = dataList.at(17).toInt();
    data.topicKeyword = dataList.at(18);

    return;
}

static void processMeetingData(QString line, MeetingData &data, QTextStream &in) {
    QStringList dataList;
    splitLineData(line, dataList, in);

    if(dataList.size() != 10) {
        qDebug() << dataList;
        return;
    }

    data.id = dataList.at(0).toInt();
    data.baseName = dataList.at(1);
    data.date = QDate::fromString(dataList.at(2), "d MMMM yyyy");
    data.numSpeeches = dataList.at(3).toInt();
    data.topic = dataList.at(4);
    data.pressRelease = dataList.at(5);
    data.outcome = dataList.at(6);
    return;
}

static void readRawData(QString filePath, QVector<RawData>& data) {
    QFile file(filePath);
    if(!file.open(QIODevice::ReadOnly | QIODevice::Text))
        return;

    QTextStream in(&file);
    in.readLine();
    while(!in.atEnd()) {
        RawData rData;
        QString line = in.readLine();
        processRawData(line, rData, in);
        data.append(rData);
    }

    file.close();
    return;
}

static void readSpeechData(QString filePath, QVector<SpeechData>& data) {
    QFile file(filePath);
    if(!file.open(QIODevice::ReadOnly | QIODevice::Text))
        return;

    QTextStream in(&file);
    in.readLine();
    while(!in.atEnd()) {
        SpeechData sData;
        QString line = in.readLine();
        processSpeechData(line, sData, in);
        data.append(sData);
    }

    file.close();
    return;
}

static void readMeetingsData(QString filePath, QVector<MeetingData>& data) {
    QFile file(filePath);
    if(!file.open(QIODevice::ReadOnly | QIODevice::Text))
        return;

    QTextStream in(&file);
    in.readLine();
    while(!in.atEnd()) {
        MeetingData mData;
        QString line = in.readLine();
        processMeetingData(line, mData, in);
        data.append(mData);
    }

    file.close();
    return;
}



static void createMeetingsTable(QString filePath, QVector<MeetingData>& data, QVector<SpeechData>& sDataVec) {
    typedef struct tag_meeting_table_entry{
        int id;
        int spv;
        int continuation;
        QString date;
        QString topic;
        QString pressRelease;
        QString outcome;
        QString topicKeyword;
    }MeetingTableEntry;

    QFile file(filePath);
    if (!file.open(QIODevice::WriteOnly | QIODevice::Text)) {
        return;
    }

    QTextStream out(&file);

    int maxTopicLength = 0;
    int maxPressReleaseLength = 0;
    int maxOutcomeLength = 0;
    for(MeetingData mData : data) {
        MeetingTableEntry mEntry;

        mEntry.id = mData.id;
        QStringList sList = mData.baseName.split("Resumption");
        if(sList.size() > 1) {
            mEntry.spv = sList.at(0).split("SPV.").at(1).toInt();
            mEntry.continuation = sList.at(1).toInt();
        }else {
            mEntry.spv = mData.baseName.split("SPV.").at(1).toInt();
            mEntry.continuation = 0;
        }
        mEntry.date = mData.date.toString("yyyy-MM-dd");
        mEntry.topic = mData.topic;
        mEntry.pressRelease = mData.pressRelease.compare("None") ? mData.pressRelease : QString("");
        mEntry.outcome = mData.outcome.compare("None") ? mData.outcome : QString("");

        for(SpeechData sData : sDataVec) {
            if(mData.baseName.compare(sData.baseName) == 0) {
                mEntry.topicKeyword = sData.topicKeyword;
            }
        }
        qDebug() << mEntry.id;

        out << mEntry.id << ","
            << mEntry.spv << ","
            << mEntry.continuation << ","
            << "\"" << mEntry.date << "\"" << ","
            << "\"" << mEntry.topic << "\"" << ","
            << "\"" << mEntry.pressRelease << "\"" << ","
            << "\"" << mEntry.outcome << "\"" << ","
            << "\"" << mEntry.topicKeyword << "\""
            << endl;

        if(maxTopicLength < mEntry.topic.size())
            maxTopicLength = mEntry.topic.size();
        if(maxPressReleaseLength < mEntry.pressRelease.size())
            maxPressReleaseLength = mEntry.pressRelease.size();
        if(maxOutcomeLength < mEntry.outcome.size())
            maxOutcomeLength = mEntry.outcome.size();
    }

    qDebug() << "max topic length: " << maxTopicLength;
    qDebug() << "max press release length: " << maxPressReleaseLength;
    qDebug() << "max outcome length: " << maxOutcomeLength;

    out.flush();
    file.close();

    return;
}

static void createSpeakersTable(QString filePath, QVector<SpeechData>& data) {
    typedef struct tag_meeting_table_entry{
        QString name;
        QString country;
        int gender;
        QString roleInUN;
    }SpeakerTableEntry;

    QFile file(filePath);
    if (!file.open(QIODevice::WriteOnly | QIODevice::Text)) {
        return;
    }

    QTextStream out(&file);

    int maxNameLength = 0;
    int maxCountryLength = 0;
    int maxRoleInUNLength = 0;
    QString name;
    QString country;
    QString roleInUN;
    QStringList speakerList;
    //QStringList speakerFilteredList;
    for(SpeechData sData : data) {
        SpeakerTableEntry sEntry;

        sEntry.name = sData.speaker;
        sEntry.country = sData.country;
        sEntry.roleInUN = sData.roleInUN;
        sEntry.gender = sData.gender;

        if(speakerList.contains(sEntry.name+sEntry.country)) {
            continue;
        }

        speakerList.append(sEntry.name+sEntry.country);
        //speakerFilteredList.append(sEntry.name);

        out << "\"" << sEntry.name << "\"" << ","
            << "\"" << sEntry.country << "\"" << ","
            << "\"" << sEntry.gender << "\"" << ","
            << "\"" << sEntry.roleInUN << "\""
            << endl;

        if(maxNameLength < sEntry.name.size()) {
            name = sEntry.name;
            maxNameLength = sEntry.name.size();
        }
        if(maxCountryLength < sEntry.country.size()) {
            country = sEntry.country;
            maxCountryLength = sEntry.country.size();
        }
        if(maxRoleInUNLength < sEntry.roleInUN.size()) {
            roleInUN = sEntry.roleInUN;
            maxRoleInUNLength = sEntry.roleInUN.size();
        }
    }

    qDebug() << "max name length: " << maxNameLength;
    qDebug() << name;
    qDebug() << "max country release length: " << maxCountryLength;
    qDebug() << country;
    qDebug() << "max role in UN length: " << maxRoleInUNLength;
    qDebug() << roleInUN;

#if 0
    speakerFilteredList.sort();
    QString prevName;
    for(QString name : speakerFilteredList) {
        out << name << endl;

        if(prevName == name)
            qDebug() << name;

        prevName = name;
    }
#endif

    out.flush();
    file.close();

    return;
}

static void createStatementsTable(QString filePath, QVector<MeetingData>& mDataVect, QVector<SpeechData>& sDataVect, QVector<RawData>& rDataVect) {
    typedef struct tag_statement_table_entry{
        int meeting_id;
        int position;
        QString speaker_name;
        QString speaker_country;
        QString text;
    }StatementTableEntry;

    QFile file(filePath);
    if (!file.open(QIODevice::WriteOnly | QIODevice::Text)) {
        return;
    }

    QTextStream out(&file);

    int maxText = 0;
    for(RawData rData : rDataVect) {
        for(SpeechData sData : sDataVect) {
            if(sData.fileName.compare(rData.fileName) == 0) {
                for(MeetingData mData : mDataVect) {
                    if(mData.baseName.compare(sData.baseName) == 0) {
                        //qDebug() << sData.fileName << "=" << rData.fileName << " || " << mData.baseName << "=" << sData.baseName;
                        StatementTableEntry sEntry;
                        sEntry.speaker_name = sData.speaker;
                        sEntry.speaker_country = sData.country;
                        sEntry.text = rData.text;
                        sEntry.position = sData.speechIdx;
                        sEntry.meeting_id = mData.id;
                        out << sEntry.meeting_id << ","
                            << sEntry.position << ","
                            << "\"" << sEntry.speaker_name << "\"" << ","
                            << "\"" << sEntry.speaker_country << "\"" << ","
                            << "\"" << sEntry.text << "\""
                            << endl;
                        if(maxText < sEntry.text.size())
                            maxText = sEntry.text.size();

                        static int count = 0;
                        qDebug() << count++;
                    }
                }
            }
        }
    }

    qDebug() << "max text size = " << maxText;

    out.flush();
    file.close();

    return;
}

static void createParticipateTable(QString filePath, QVector<MeetingData>& mDataVect, QVector<SpeechData>& sDataVect, QVector<RawData>& rDataVect) {
    typedef struct tag_participate_table_entry{
        int meeting_id;
        QString speaker_name;
        QString speaker_country;
        QString type;
    }ParticipateTableEntry;

    QFile file(filePath);
    if (!file.open(QIODevice::WriteOnly | QIODevice::Text)) {
        return;
    }

    QTextStream out(&file);

    int maxType = 0;
    QStringList speakerList;
    for(SpeechData sData : sDataVect) {
        for(MeetingData mData : mDataVect) {
            if(mData.baseName.compare(sData.baseName) == 0) {
                //qDebug() << sData.fileName << "=" << rData.fileName << " || " << mData.baseName << "=" << sData.baseName;
                ParticipateTableEntry pEntry;
                pEntry.meeting_id = mData.id;
                pEntry.speaker_name = sData.speaker;
                pEntry.speaker_country = sData.country;
                pEntry.type = sData.participationType;

                if(speakerList.contains(pEntry.speaker_name+pEntry.speaker_country+pEntry.meeting_id)) {
                    continue;
                }
                speakerList.append(pEntry.speaker_name+pEntry.speaker_country+pEntry.meeting_id);

                out << pEntry.meeting_id << ","
                    << "\"" << pEntry.speaker_name << "\"" << ","
                    << "\"" << pEntry.speaker_country << "\"" << ","
                    << "\"" << pEntry.type << "\""
                    << endl;
                if(maxType < pEntry.type.size())
                    maxType = pEntry.type.size();

                static int count = 0;
                qDebug() << count++;
            }
        }
    }

    qDebug() << "max type size = " << maxType;

    out.flush();
    file.close();

    return;
}

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    QVector<MeetingData> meetingsData;
    QVector<SpeechData> speechData;
    QVector<RawData> rawData;
    readMeetingsData("/Users/vijaykr/Downloads/CIS 550 Project/DATA/UNSC/RDATA-TO-CSV/meta_meetings.csv", meetingsData);
    readSpeechData("/Users/vijaykr/Downloads/CIS 550 Project/DATA/UNSC/RDATA-TO-CSV/speeches_new.csv", speechData);
    readRawData("/Users/vijaykr/Downloads/CIS 550 Project/DATA/UNSC/RDATA-TO-CSV/raw_docs.csv", rawData);

    qDebug() << "Total Meetings: " << meetingsData.size();
    qDebug() << "Total Speeches: " << speechData.size();
    qDebug() << "Total RawData : " << rawData.size();

    qDebug() << "start writing meetings data";
    createMeetingsTable("meetings.csv", meetingsData, speechData);
    qDebug() << "start writing speakers data";
    createSpeakersTable("speakers.csv", speechData);
    qDebug() << "start writing statements data";
    createStatementsTable("statements.csv", meetingsData, speechData, rawData);
    qDebug() << "start writing participation data";
    createParticipateTable("participation.csv", meetingsData, speechData, rawData);
    qDebug() << "finished writing all data";

    meetingsData.clear();
    speechData.clear();
    rawData.clear();

    return a.exec();
}
