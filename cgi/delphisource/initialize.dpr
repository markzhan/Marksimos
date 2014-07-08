program initialize;

{$APPTYPE CONSOLE}

{$R *.res}

uses
  System.SysUtils, Windows, Classes,
  MA0_SharedElements, MA0_AdministratorImportedElements,
  superobject,
  System.TypInfo, uDecisionFileIO, CgiCommonFunction, Generics.Collections;

var
  config: TConfigurationRecord  ;
  params: TDictionary<String, String>;
  sValue: string;
  result: Integer;

begin
  SetMultiByteConversionCodePage(CP_UTF8);

  try
    WriteLn('Content-type: application/json');
    Writeln();
    sValue := getVariable('QUERY_STRING');
    //sValue := 'seminar=TTT&simulation_span=3&team1=companyA&team2=companyB';
    params := Explode(sValue);

    config.cr_AdministratorFilesLocation := ConvertStringToPathArray('C:\Program Files\Apache Software Foundation\Apache2.2\cgi-bin\');

//    config.cr_TeamsFilesLocations[1] :=  ConvertStringToPathArray('C:\Program Files\Apache Software Foundation\Apache2.2\cgi-bin\');
//    config.cr_TeamsFilesLocations[2] :=  ConvertStringToPathArray('C:\Program Files\Apache Software Foundation\Apache2.2\cgi-bin\');
//    config.cr_TeamsFilesLocations[3] :=  ConvertStringToPathArray('C:\Program Files\Apache Software Foundation\Apache2.2\cgi-bin\');
//    config.cr_TeamsFilesLocations[4] :=  ConvertStringToPathArray('C:\Program Files\Apache Software Foundation\Apache2.2\cgi-bin\');
//    config.cr_TeamsFilesLocations[5] :=  ConvertStringToPathArray('C:\Program Files\Apache Software Foundation\Apache2.2\cgi-bin\');
//    config.cr_TeamsFilesLocations[6] :=  ConvertStringToPathArray('C:\Program Files\Apache Software Foundation\Apache2.2\cgi-bin\');

//    config.cr_BackupFilesLocation := ConvertStringToPathArray('C:\Program Files\Apache Software Foundation\Apache2.2\cgi-bin\');
//
//    config.cr_RestoreFilesLocation := ConvertStringToPathArray('C:\Program Files\Apache Software Foundation\Apache2.2\cgi-bin\');
    if not params.ContainsKey('seminar') or (params['seminar'] = '') then raise Exception.Create('seminar is required.');
    if not params.ContainsKey('simulation_span') or (params['simulation_span'] = '') then raise Exception.Create('simulation_span is required.');

    StringToWideChar(params['seminar'], config.cr_SeminarID, Length(config.cr_SeminarID));
    config.cr_OperatingMode := ONLINE;
    config.cr_SimulationVariant := FMCG;
    config.cr_TargetMarket := GENERIC;
    config.cr_SimulationSpan := StrToInt(params['simulation_span']);

    if not params.ContainsKey('team1') or (params['team1'] = '') then raise Exception.Create('team1 is required');
    if not params.ContainsKey('team2') or (params['team2'] = '') then raise Exception.Create('team2 is required');

    StringToWideChar(params['team1'], config.cr_TeamsNames[1], Length(config.cr_TeamsNames[1]));
    StringToWideChar(params['team2'], config.cr_TeamsNames[2], Length(config.cr_TeamsNames[2]));

    if(params.ContainsKey('team3') and (params['team3'] <> '')) then StringToWideChar(params['team3'], config.cr_TeamsNames[3], Length(config.cr_TeamsNames[3]));
    if(params.ContainsKey('team4') and (params['team4'] <> '')) then StringToWideChar(params['team4'], config.cr_TeamsNames[4], Length(config.cr_TeamsNames[4]));
    if(params.ContainsKey('team5') and (params['team5'] <> '')) then StringToWideChar(params['team5'], config.cr_TeamsNames[5], Length(config.cr_TeamsNames[5]));
    if(params.ContainsKey('team6') and (params['team6'] <> '')) then StringToWideChar(params['team6'], config.cr_TeamsNames[6], Length(config.cr_TeamsNames[6]));

    if(params.ContainsKey('team1') and (params['team1'] <> '')) then config.cr_ActiveTeams[1] :=  True;
    if(params.ContainsKey('team2') and (params['team2'] <> '')) then config.cr_ActiveTeams[2] :=  True;
    if(params.ContainsKey('team3') and (params['team3'] <> '')) then config.cr_ActiveTeams[3] :=  True;
    if(params.ContainsKey('team4') and (params['team4'] <> '')) then config.cr_ActiveTeams[4] :=  True;
    if(params.ContainsKey('team5') and (params['team5'] <> '')) then config.cr_ActiveTeams[5] :=  True;
    if(params.ContainsKey('team6') and (params['team6'] <> '')) then config.cr_ActiveTeams[6] :=  True;

    result := InitialiseFiles(config);

    //no sure why -3 period runs three times
    if(result = init_OK) then result := RunOnePeriod(config, -3)
    else raise Exception.Create('Simulation error' + IntToStr(result));
    if(result = sim_OK) then result := RunOnePeriod(config, -3)
    else raise Exception.Create('Simulation error' + IntToStr(result));
    if(result = sim_OK) then result := RunOnePeriod(config, -3)
    else raise Exception.Create('Simulation error' + IntToStr(result));
    if(result = sim_OK) then result := RunOnePeriod(config, -3)
    else raise Exception.Create('Simulation error' + IntToStr(result));

    if(result = sim_OK) then result := RunOnePeriod(config, -2)
    else raise Exception.Create('Simulation error' + IntToStr(result));
    if(result = sim_OK) then result := RunOnePeriod(config, -1)
    else raise Exception.Create('Simulation error' + IntToStr(result));
    if(result = sim_OK) then result := RunOnePeriod(config, 0)
    else raise Exception.Create('Simulation error' + IntToStr(result));

    Writeln('{"message": "init_success"}');
  except
    on E: Exception do
      Writeln('{"message": "' + E.ClassName + ': ' + E.Message +'"}');
  end;
end.